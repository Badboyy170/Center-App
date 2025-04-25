import { useLocalSearchParams } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import forms from "@/styles/forms";

export default function ExamDetails() {
  const { id } = useLocalSearchParams();
  const [students, setStudents] = useState<any[]>([]);
  const [newStudent, setNewStudent] = useState({ name: "", studentId: "", grade: "" });
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [focusedFields, setFocusedFields] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Fetch the exam data
  const fetchExam = async () => {
    try {
      const examRef = doc(db, "exams", id as string);
      const examSnap = await getDoc(examRef);
      if (examSnap.exists()) {
        const data = examSnap.data();
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error("Error fetching exam data:", error);
    }
  };

  // Add a new student to the exam
  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.studentId || !newStudent.grade) {
      Swal.fire({ icon: "error", title: "Missing Fields", text: "Fill all student fields." });
      return;
    }

    const updatedStudents = [...students, newStudent];
    try {
      await updateDoc(doc(db, "exams", id as string), {
        students: updatedStudents,
      });
      setStudents(updatedStudents);
      setNewStudent({ name: "", studentId: "", grade: "" });
      Swal.fire({ icon: "success", title: "Added", text: "Student added successfully." });
    } catch (error) {
      console.error("Error adding student:", error);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to add student." });
    }
  };

  // Delete a student from the exam
  const handleDeleteStudent = async (studentId: string) => {
    const updatedStudents = students.filter(student => student.studentId !== studentId);
    try {
      await updateDoc(doc(db, "exams", id as string), {
        students: updatedStudents,
      });
      setStudents(updatedStudents);
      Swal.fire({ icon: "success", title: "Deleted", text: "Student deleted successfully." });
    } catch (error) {
      console.error("Error deleting student:", error);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to delete student." });
    }
  };

  // Update a student's data
  const handleUpdateStudent = async () => {
    const updatedStudents = students.map(student => {
      if (student.studentId === editingStudent.studentId) {
        return editingStudent;
      }
      return student;
    });

    try {
      await updateDoc(doc(db, "exams", id as string), {
        students: updatedStudents,
      });
      setStudents(updatedStudents);
      setEditingStudent(null);
      setFocusedFields([]);
      Swal.fire({ icon: "success", title: "Updated", text: "Student updated successfully." });
    } catch (error) {
      console.error("Error updating student:", error);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to update student." });
    }
  };

  // Start editing a student's data
  const startEditing = (student: any) => {
    setEditingStudent({ ...student });
    setFocusedFields(["name", "studentId", "grade"]);
  };

  const handleFocus = (field: string) => {
    setFocusedFields(prevFields => [...prevFields, field]);
  };

  // Filter students based on search query
  const filteredStudents = students.filter(student => {
    return (
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  useEffect(() => {
    fetchExam();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
      <View style={forms.formContainer}>
        {/* Search Bar */}
        <TextInput
          style={[forms.formInput, { marginBottom: 5, height: 35 }]}
          placeholder="Search by Name, ID or Grade"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <Text style={forms.formTitle}>Students Grades In Exam</Text>

        <FlatList
          data={filteredStudents}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[forms.listItem, { marginBottom: 8 }]}>
              {/* Student Name */}
              <View style={forms.fieldContainer}>
                <Text style={[forms.fieldTitle, { fontSize: 14 }]}>Name</Text>
                <TextInput
                  style={[
                    forms.formInput,
                    focusedFields.includes("name") && { borderColor: "green", borderWidth: 2 },
                    { height: 20 },
                  ]}
                  placeholder="Name"
                  value={editingStudent?.studentId === item.studentId ? editingStudent.name : item.name}
                  onChangeText={(text) => setEditingStudent({ ...editingStudent, name: text })}
                  onFocus={() => handleFocus("name")}
                />
              </View>

              {/* Student ID */}
              <View style={forms.fieldContainer}>
                <Text style={[forms.fieldTitle, { fontSize: 14 }]}>ID</Text>
                <TextInput
                  style={[
                    forms.formInput,
                    focusedFields.includes("studentId") && { borderColor: "green", borderWidth: 2 },
                    { height: 20 },
                  ]}
                  placeholder="ID"
                  value={editingStudent?.studentId === item.studentId ? editingStudent.studentId : item.studentId}
                  onChangeText={(text) => setEditingStudent({ ...editingStudent, studentId: text })}
                  onFocus={() => handleFocus("studentId")}
                />
              </View>

              {/* Grade */}
              <View style={forms.fieldContainer}>
                <Text style={[forms.fieldTitle, { fontSize: 14 }]}>Grade</Text>
                <TextInput
                  style={[
                    forms.formInput,
                    focusedFields.includes("grade") && { borderColor: "green", borderWidth: 2 },
                    { height: 20 },
                  ]}
                  placeholder="Grade"
                  value={editingStudent?.studentId === item.studentId ? editingStudent.grade : item.grade}
                  onChangeText={(text) => setEditingStudent({ ...editingStudent, grade: text })}
                  onFocus={() => handleFocus("grade")}
                />
              </View>

              {/* Update student */}
              {editingStudent && editingStudent.studentId === item.studentId ? (
                <TouchableOpacity
                  style={[
                    forms.formButton,
                    { backgroundColor: "green", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6, minWidth: 100 },
                  ]}
                  onPress={handleUpdateStudent}
                >
                  <Text style={forms.formButtonText}>Update</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    forms.formButton,
                    { backgroundColor: "blue", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6, minWidth: 100 },
                  ]}
                  onPress={() => startEditing(item)}
                >
                  <Text style={forms.formButtonText}>Edit</Text>
                </TouchableOpacity>
              )}

              {/* Delete student button */}
              <TouchableOpacity
                style={[
                  forms.formButton,
                  { backgroundColor: "red", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6, minWidth: 100 },
                ]}
                onPress={() => handleDeleteStudent(item.studentId)}
              >
                <Text style={forms.formButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <View style={{ marginTop: 5, height: 35 }}>
          <Text style={forms.formTitle}>Add Student</Text>
          <TextInput
            style={[forms.formInput, { height: 40 }]}
            placeholder="Student Name"
            value={newStudent.name}
            onChangeText={(text) => setNewStudent({ ...newStudent, name: text })}
          />
          <TextInput
            style={[forms.formInput, { height: 40 }]}
            placeholder="Student ID"
            value={newStudent.studentId}
            onChangeText={(text) => setNewStudent({ ...newStudent, studentId: text })}
          />
          <TextInput
            style={[forms.formInput, { height: 40 }]}
            placeholder="Grade"
            value={newStudent.grade}
            onChangeText={(text) => setNewStudent({ ...newStudent, grade: text })}
          />
          <TouchableOpacity
            style={[
              forms.formButton,
              { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6, minWidth: 120, marginTop: 15 },
            ]}
            onPress={handleAddStudent}
          >
            <Text style={forms.formButtonText}>Add Student</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
