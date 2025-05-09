import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Platform } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { db } from "@/config/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import forms from "@/styles/forms";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
 
function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function NewAttendance() {
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [date, setDate] = useState(getToday());
  const [studentSearch, setStudentSearch] = useState("");
  const [iconInfo, setIconInfo] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      const querySnapshot = await getDocs(collection(db, "groups"));
      setGroups(querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
      })));
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    if (!selectedGroup) {
      setStudents([]);
      setSelectedStudent("");
      return;
    }
    const fetchStudents = async () => {
      // Get student-group assignments for this group
      const sgSnap = await getDocs(collection(db, "studentGroups"));
      const studentIds = sgSnap.docs
        .filter((doc) => doc.data().groupId === selectedGroup)
        .map((doc) => doc.data().studentId);

      if (studentIds.length === 0) {
        setStudents([]);
        setSelectedStudent("");
        return;
      }

      const studentsSnap = await getDocs(collection(db, "students"));
      setStudents(
        studentsSnap.docs
          .filter((doc) => studentIds.includes(doc.id))
          .map((doc) => ({
            id: doc.id,
            name: doc.data().name || "",
          }))
      );
    };
    fetchStudents();
  }, [selectedGroup]);



  // Filter students by search string (case-insensitive)
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleAddAttendance = async () => {
    if (!selectedGroup || !selectedStudent || !date) {
      setIconInfo({ type: "error", message: "Please select group, student, and date." });
      setTimeout(() => setIconInfo(null), 2000);
      return;
    }
    try {
      await addDoc(collection(db, "attendance"), {
        groupId: selectedGroup,
        studentId: selectedStudent,
        date,
      });
      setIconInfo({ type: "success", message: "Attendance recorded successfully!" });
      setTimeout(() => setIconInfo(null), 2000);
      setSelectedGroup("");
      setSelectedStudent("");
      setDate(getToday());
    } catch (error) {
      setIconInfo({ type: "error", message: "Failed to add attendance." });
      setTimeout(() => setIconInfo(null), 2000);
    }
  };

 

  return (
    <View style={forms.formContainer}>
      <Text style={forms.formTitle}>New Attendance</Text>
      <View style={forms.inputContainer}>
        <Text style={{ fontWeight: "bold", marginRight: 10 }}>Group:</Text>
        <Picker
          selectedValue={selectedGroup}
          onValueChange={setSelectedGroup}
          style={forms.picker}
        >
          <Picker.Item label="Select Group" value="" />
          {groups.map((g) => (
            <Picker.Item key={g.id} label={g.name} value={g.id} />
          ))}
        </Picker>
      </View>
      <View style={forms.inputContainer}>
        <Text style={{ fontWeight: "bold", marginRight: 10 }}>Student:</Text>
        <TextInput
          style={[forms.formInput, { flex: 1, marginRight: 8 }]}
          placeholder="Search student..."
          value={studentSearch}
          onChangeText={setStudentSearch}
          editable={!!selectedGroup}
        />
      </View>
      <View style={forms.inputContainer}>
        <Picker
          selectedValue={selectedStudent}
          onValueChange={setSelectedStudent}
          style={forms.picker}
          enabled={!!selectedGroup}
        >
          <Picker.Item label="Select Student" value="" />
          {filteredStudents.map((s) => (
            <Picker.Item key={s.id} label={s.name} value={s.id} />
          ))}
        </Picker>
      </View>
      <View style={forms.inputContainer}>
        <Text style={{ fontWeight: "bold", marginRight: 10 }}>Date:</Text>
        <TextInput
          style={forms.formInput}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />
      </View>
     
      <TouchableOpacity
        style={forms.submitButton}
        onPress={handleAddAttendance}
      >
        <Text style={forms.submitButtonText}>Add Attendance</Text>
      </TouchableOpacity>
      {iconInfo && (
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          position: "absolute",
          top: "45%",
          left: 0,
          right: 0,
          zIndex: 100,
          justifyContent: "center",
          backgroundColor: "rgba(44,62,80,0.95)",
          borderRadius: 12,
          padding: 18,
          marginHorizontal: 24,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        }}>
          <Icon
            name={
              iconInfo.type === "success"
                ? "check-circle"
                : iconInfo.type === "error"
                ? "close-circle"
                : "information"
            }
            size={28}
            color={
              iconInfo.type === "success"
                ? "#4BB543"
                : iconInfo.type === "error"
                ? "#e74c3c"
                : "#f1c40f"
            }
            style={{ marginRight: 12 }}
          />
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16, maxWidth: 250, textAlign: "center" }}>
            {iconInfo.message}
          </Text>
        </View>
      )}
    </View>
  );
}