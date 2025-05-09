import React, { useEffect, useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Platform, Dimensions, ScrollView } from "react-native";
import { db } from "@/config/firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import Swal from "sweetalert2";
import forms from "@/styles/forms";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function AddExam() {
  const [name, setName] = useState("");
  const [grades, setGrades] = useState<{ id: string; name: string }[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [score, setScore] = useState<string>("");

  // Fetch grades on mount
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "grades"));
        const gradesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || "",
        }));
        setGrades(gradesData);
      } catch (error) {
        console.error("Error fetching grades: ", error);
      }
    };
    fetchGrades();
  }, []);

  // Fetch groups when grade changes
  useEffect(() => {
    const fetchGroups = async (gradeId: string) => {
      try {
        const q = query(collection(db, "groups"), where("gradeId", "==", gradeId));
        const snap = await getDocs(q);
        const groupsData = snap.docs.map((d) => ({
          id: d.id,
          name: d.data().name || "",
        }));
        setGroups(groupsData);
        setSelectedGroup("");
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };
    if (selectedGrade) fetchGroups(selectedGrade);
    else {
      setGroups([]);
      setSelectedGroup("");
    }
  }, [selectedGrade]);

  const handleAddExam = async () => {
    if (!name || !selectedGrade || !selectedGroup || !date || !score) {
      Swal.fire({ icon: "error", title: "Missing Fields", text: "Please fill in all fields." });
      return;
    }

    try {
      await addDoc(collection(db, "exams"), {
        name,
        gradeId: selectedGrade,
        groupId: selectedGroup,
        date: date,
        score: Number(score),
        students: [],
      });
      Swal.fire({ icon: "success", title: "Exam Added", text: "Exam added successfully!" });
      setName("");
      setSelectedGrade("");
      setGroups([]);
      setSelectedGroup("");
      setDate("");
      setScore("");
    } catch (error) {
      console.error("Error adding Exam: ", error);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to add Exam." });
    }
  };

  // Responsive layout
  const windowWidth = Dimensions.get("window").width;
  const isSmallScreen = windowWidth < 600;
  const containerStyle = {
    ...forms.formContainer,
    margin: isSmallScreen ? 8 : 20,
    padding: isSmallScreen ? 10 : 20,
    borderRadius: 10,
    minWidth: isSmallScreen ? undefined : 350,
    maxWidth: isSmallScreen ? "100%" : 500,
    alignSelf: "center",
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={containerStyle}>
        <Text style={forms.formTitle}>Add Exam</Text>
        <View style={forms.inputContainer}>
          <Icon name="file-document-edit-outline" size={20} style={forms.inputIcon} />
          <TextInput
            style={forms.formInput}
            placeholder="Exam Name"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={forms.inputContainer}>
          <Icon name="school-outline" size={20} style={forms.inputIcon} />
          <Picker
            selectedValue={selectedGrade}
            onValueChange={value => setSelectedGrade(value)}
            style={forms.picker}
          >
            <Picker.Item label="Select Grade" value="" />
            {grades.map((g) => (
              <Picker.Item key={g.id} label={g.name} value={g.id} />
            ))}
          </Picker>
        </View>
        {groups.length > 0 && (
          <View style={forms.inputContainer}>
            <Icon name="account-group" size={20} style={forms.inputIcon} />
            <Picker
              selectedValue={selectedGroup}
              onValueChange={(value: string) => setSelectedGroup(value)}
              style={forms.picker}
            >
              <Picker.Item label="Select Group" value="" />
              {groups.map((g) => (
                <Picker.Item key={g.id} label={g.name} value={g.id} />
              ))}
            </Picker>
          </View>
        )}
        <View style={forms.inputContainer}>
          <Icon name="calendar" size={20} style={forms.inputIcon} />
          <TextInput
            style={forms.formInput}
            placeholder="YYYY-MM-DD"
            value={date || new Date().toISOString().split("T")[0]}
            onChangeText={setDate}
          />
        </View>
        <View style={forms.inputContainer}>
          <Icon name="star" size={20} style={forms.inputIcon} />
          <TextInput
            style={forms.formInput}
            placeholder="Exam Score"
            value={score}
            onChangeText={setScore}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity style={forms.formButton} onPress={handleAddExam}>
          <Text style={forms.formButtonText}>Add Exam</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
