import React, { useEffect, useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { db } from "@/config/firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import Swal from "sweetalert2";
import forms from "@/styles/forms";
import { Picker } from "@react-native-picker/picker";

export default function AddExam() {
  const [name, setName] = useState("");
  const [studyLevel, setStudyLevel] = useState<string>("");
  const [groupNumbers, setGroupNumbers] = useState<number[]>([]);
  const [selectedGroupNumber, setSelectedGroupNumber] = useState<number | null>(null);
  const [date, setDate] = useState("");

  const fetchGroupNumbers = async (level: string) => {
    try {
      const q = query(collection(db, "groups"), where("studyLevel", "==", level));
      const snap = await getDocs(q);
      const nums = snap.docs.map((d) => d.data().groupNumber as number);
      setGroupNumbers(nums);
      setSelectedGroupNumber(null);
    } catch (err) {
      console.error("Error fetching group numbers:", err);
    }
  };

  useEffect(() => {
    if (studyLevel) fetchGroupNumbers(studyLevel);
    else {
      setGroupNumbers([]);
      setSelectedGroupNumber(null);
    }
  }, [studyLevel]);

  const handleAddExam = async () => {
    if (!name || !studyLevel || !selectedGroupNumber || !date) {
      Swal.fire({ icon: "error", title: "Missing Fields", text: "Please fill in all fields." });
      return;
    }

    try {
      await addDoc(collection(db, "exams"), {
        name,
        studyLevel,
        groupNum: selectedGroupNumber,
        date,
        students: [],
      });
      Swal.fire({ icon: "success", title: "Exam Added", text: "Exam added successfully!" });
      setName("");
      setStudyLevel("");
      setGroupNumbers([]);
      setSelectedGroupNumber(null);
      setDate("");
    } catch (error) {
      console.error("Error adding Exam: ", error);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to add Exam." });
    }
  };

  return (
    <View style={forms.formContainer}>
      <Text style={forms.formTitle}>Add Exam</Text>
      <TextInput style={forms.formInput} placeholder="Exam Name" value={name} onChangeText={setName} />
      <Picker selectedValue={studyLevel} onValueChange={value => setStudyLevel(value)} style={forms.picker}>
        <Picker.Item label="Study Level" value="" />
        {[...Array(10)].map((_, i) => {
          const num = (i + 1).toString();
          return <Picker.Item key={num} label={num} value={num} />;
        })}
      </Picker>
      {groupNumbers.length > 0 && (
        <Picker
          selectedValue={selectedGroupNumber}
          onValueChange={(value: number) => setSelectedGroupNumber(value)}
          style={forms.picker}
        >
          <Picker.Item label="Group Number" value={null} />
          {groupNumbers.map((n) => (
            <Picker.Item key={n} label={n.toString()} value={n} />
          ))}
        </Picker>
      )}
      <TextInput style={forms.formInput} placeholder="Date" value={date} onChangeText={setDate} />
      <TouchableOpacity style={forms.formButton} onPress={handleAddExam}>
        <Text style={forms.formButtonText}>Add Exam</Text>
      </TouchableOpacity>
    </View>
  );
}