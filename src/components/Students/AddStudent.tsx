import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import forms from "@/styles/forms";
import { FaUser, FaCalendarAlt, FaGraduationCap } from "react-icons/fa";

export default function AddStudent() {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [grade, setGrade] = useState("");

    const handleAddStudent = async () => {
        if (!name || !age || !grade) {
            Swal.fire({
                icon: "error",
                title: "Missing Fields",
                text: "Please fill in all fields.",
                position: "center",
            });
            return;
        }

        try {
            await addDoc(collection(db, "students"), {
                name,
                age: parseInt(age, 10),
                grade,
            });
            Swal.fire({
                icon: "success",
                title: "Student Added",
                text: "Student added successfully!",
                position: "center",
            });
            setName("");
            setAge("");
            setGrade("");
        } catch (error) {
            console.error("Error adding student: ", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to add student.",
                position: "center",
            });
        }
    };

    return (
        <View style={forms.formContainer}>
            <Text style={forms.formTitle}>Add Student</Text>
            <View style={forms.inputContainer}>
                <FaUser style={forms.inputIcon} />
                <TextInput
                    style={forms.formInput}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
            </View>
            <View style={forms.inputContainer}>
                <FaCalendarAlt style={forms.inputIcon} />
                <TextInput
                    style={forms.formInput}
                    placeholder="Age"
                    value={age}
                    keyboardType="numeric"
                    onChangeText={setAge}
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
            <TouchableOpacity style={forms.formButton} onPress={handleAddStudent}>
                <Text style={forms.formButtonText}>Add Student</Text>
            </TouchableOpacity>
        </View>
    );
}
