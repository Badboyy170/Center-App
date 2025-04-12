import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { db } from "@/config/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import forms from "@/styles/forms";

export default function ManageStudents() {
  interface Student {
    id: string;
    name: string;
    age: number;
    grade: string;
  }

  const [students, setStudents] = useState<Student[]>([]);

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      const studentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
        age: doc.data().age || 0,
        grade: doc.data().grade || "",
      })) as Student[];
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students: ", error);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await deleteDoc(doc(db, "students", id));
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Student deleted successfully!",
        position: "center",
      });
      setStudents((prev) => prev.filter((student) => student.id !== id));
    } catch (error) {
      console.error("Error deleting student: ", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete student.",
        position: "center",
      });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <View style={forms.formContainer}>
      <Text style={forms.formTitle}>Manage Students</Text>
      {students.length === 0 ? (
        <Text style={forms.noDataText}>No students exist</Text>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={forms.listItem}>
              <View>
                <Text style={forms.listItemTitle}>{item.name}</Text>
                <Text>Age: {item.age}</Text>
                <Text>Grade: {item.grade}</Text>
              </View>
              <TouchableOpacity
                style={forms.deleteButton}
                onPress={() => handleDeleteStudent(item.id)}
              >
                <Text style={forms.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
