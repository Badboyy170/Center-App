import { useState, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { db } from "@/config/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
import forms from "@/styles/forms";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AwesomeAlert from "react-native-awesome-alerts";

export default function AddStudent() {
    const [name, setName] = useState("");
    const [studentPhone, setStudentPhone] = useState("");
    const [parentPhone, setParentPhone] = useState("");
    const [grade, setGrade] = useState("");
    const [grades, setGrades] = useState<{ id: string; name: string }[]>([]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(true);

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

    const showAlert = (title: string, message: string, success: boolean) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertSuccess(success);
        setAlertVisible(true);
    };

    const handleAddStudent = async () => {
        if (!name || !studentPhone || !parentPhone || !grade) {
            showAlert("Missing Fields", "Please fill in all fields.", false);
            return;
        }

        try {
            await addDoc(collection(db, "students"), {
                name,
                studentPhone,
                parentPhone,
                grade,
            });
            showAlert("Student Added", "Student added successfully!", true);
            setName("");
            setStudentPhone("");
            setParentPhone("");
            setGrade("");
        } catch (error) {
            console.error("Error adding student: ", error);
            showAlert("Error", "Failed to add student.", false);
        }
    };

    const handleAlertConfirm = () => {
        setAlertVisible(false);
    };

    return (
        <View style={forms.formContainer}>
            <Text style={forms.formTitle}>Add Student</Text>
            <View style={forms.inputContainer}>
                <Icon name="account" size={20} style={forms.inputIcon} />
                <TextInput
                    style={forms.formInput}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
            </View>
            <View style={forms.inputContainer}>
                <Icon name="phone" size={20} style={forms.inputIcon} />
                <TextInput
                    style={forms.formInput}
                    placeholder="Student Phone"
                    value={studentPhone}
                    keyboardType="phone-pad"
                    onChangeText={setStudentPhone}
                />
            </View>
            <View style={forms.inputContainer}>
                <Icon name="phone" size={20} style={forms.inputIcon} />
                <TextInput
                    style={forms.formInput}
                    placeholder="Parent Phone"
                    value={parentPhone}
                    keyboardType="phone-pad"
                    onChangeText={setParentPhone}
                />
            </View>
            <View style={forms.inputContainer}>
                <Icon name="school-outline" size={20} style={forms.inputIcon} />
                <Picker
                    selectedValue={grade}
                    onValueChange={(itemValue) => setGrade(itemValue)}
                    style={forms.picker}
                >
                    <Picker.Item label="Select Grade" value="" />
                    {grades.map((g) => (
                        <Picker.Item key={g.id} label={g.name} value={g.id} />
                    ))}
                </Picker>
            </View>
            <TouchableOpacity style={forms.formButton} onPress={handleAddStudent}>
                <Text style={forms.formButtonText}>Add Student</Text>
            </TouchableOpacity>
            <AwesomeAlert
                show={alertVisible}
                showProgress={false}
                title={alertTitle}
                message={alertMessage}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={true}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor={alertSuccess ? "#4BB543" : "#d33"}
                onConfirmPressed={handleAlertConfirm}
                onDismiss={handleAlertConfirm}
            />
        </View>
    );
}
