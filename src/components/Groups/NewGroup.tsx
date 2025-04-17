import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import forms from "@/styles/forms";
import { FaUser, FaCalendarAlt, FaGraduationCap } from "react-icons/fa";

export default function Addgroup() {
  const [name, setName] = useState("");
  const [classRoom, setClassRoom] = useState("");
  const [grade, setGrade] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");

  const handleAddgroup = async () => {
    if (!name || !classRoom || !grade || !selectedTerm) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in all fields.",
        position: "center",
      });
      return;
    }

    try {
      await addDoc(collection(db, "groups"), {
        name,
        classRoom: parseInt(classRoom, 10),
        grade,
        term: selectedTerm,
      });
      Swal.fire({
        icon: "success",
        title: "Group Added",
        text: "Group added successfully!",
        position: "center",
      });
      setName("");
      setClassRoom("");
      setGrade("");
      setSelectedTerm("");
    } catch (error) {
      console.error("Error adding group: ", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add group.",
        position: "center",
      });
    }
  };

  return (
    <View style={forms.formContainer}>
      <Text style={forms.formTitle}>Add Group</Text>

      

      <View style={forms.inputContainer}>
        <FaUser style={forms.inputIcon} />
        <TextInput
          style={forms.formInput}
          placeholder="Group Name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.termContainer}>
        <Text style={styles.termTitle}>Select the academic term:</Text>

        <TouchableOpacity
          style={[
            styles.termOption,
            selectedTerm === 'First Term' && styles.selectedTerm
          ]}
          onPress={() => setSelectedTerm('First Term')}
        >
          <Text style={styles.termText}>
            {selectedTerm === 'First Term' ? '✅ ' : ''}First Term
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.termOption,
            selectedTerm === 'Second Term' && styles.selectedTerm
          ]}
          onPress={() => setSelectedTerm('Second Term')}
        >
          <Text style={styles.termText}>
            {selectedTerm === 'Second Term' ? '✅ ' : ''}Second Term
          </Text>
        </TouchableOpacity>

        {selectedTerm && (
          <Text style={styles.termSelectedText}>You selected: {selectedTerm}</Text>
        )}
      </View>
      <View style={forms.inputContainer}>
        <FaCalendarAlt style={forms.inputIcon} />
        <TextInput
          style={forms.formInput}
          placeholder="Class Room"
          value={classRoom}
          keyboardType="numeric"
          onChangeText={setClassRoom}
        />
      </View>

      <View style={forms.inputContainer}>
        <FaGraduationCap style={forms.inputIcon} />
        <TextInput
          style={forms.formInput}
          placeholder="Grade"
          value={grade}
          onChangeText={setGrade}
        />
      </View>

      <TouchableOpacity style={forms.formButton} onPress={handleAddgroup}>
        <Text style={forms.formButtonText}>Add Group</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  termContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9'
  },
  termTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  termOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  selectedTerm: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C'
  },
  termText: {
    fontSize: 14,
    color: '#000'
  },
  termSelectedText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic'
  }
});
