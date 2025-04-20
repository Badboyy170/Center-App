import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import forms from "@/styles/forms";
import { FaUser, FaCalendarAlt, FaGraduationCap } from "react-icons/fa";

import { Picker } from '@react-native-picker/picker';


export default function AddExam() {
    const [name, setName] = useState("");
    const [groupNum, setGroupNum] = useState("");
    const [date, setDate] = useState("");

    const[studyLevel , setStudyLevel] = useState("");


    const handleAddStudent = async () => {
        if (!name || !groupNum || !date) {
            Swal.fire({
                icon: "error",
                title: "Missing Fields",
                text: "Please fill in all fields.",
                position: "center",
            });
            return;
        }

        try {
            await addDoc(collection(db, "exams"), {
                name,
                groupNum: parseInt(groupNum, 10),
                date,
            });
            Swal.fire({
                icon: "success",
                title: "Exam Added",
                text: "Exam added successfully!",
                position: "center",
            });
            setName("");
            setGroupNum("");
            setDate("");
        } catch (error) {
            console.error("Error adding Exam: ", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to add Exam.",
                position: "center",
            });
        }
    };

    return (
        <View style={forms.formContainer}>
            <Text style={forms.formTitle}>Add Exam</Text>
            <View style={forms.inputContainer}>
                <FaUser style={forms.inputIcon} />
                <TextInput
                    style={forms.formInput}
                    placeholder="Exam Name"
                    
                    value={name}
                    onChangeText={setName}
                />
            </View>

     <View style={forms.pickerContainer}>
        <Picker
            selectedValue={studyLevel}
            onValueChange={(value : string) => setStudyLevel(value)}
            style={forms.picker}
        >
            <Picker.Item label=" Study Level"  value="" />
            {[...Array(10)].map((_, i) => {
            const num = (i + 1).toString();
            return <Picker.Item key={num} label={num} value={num} />;
            })}
        </Picker>
    </View>

     
            <View style={forms.inputContainer}>
                <FaCalendarAlt style={forms.inputIcon} />
                <TextInput
                    style={forms.formInput}
                    placeholder="Group Number"
                    value={groupNum}
                    keyboardType="numeric"
                    onChangeText={setGroupNum}
                />
            </View>

            <View style={forms.inputContainer}>
                <FaGraduationCap style={forms.inputIcon} />
                <TextInput
                    style={forms.formInput}
                    placeholder="Date as day/month/year"
                    value={date}
                    onChangeText={setDate}
                />
            </View>
            <TouchableOpacity style={forms.formButton} onPress={handleAddStudent}>
                <Text style={forms.formButtonText}>add Exam</Text>
            </TouchableOpacity>
        </View>
    );
}
