import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import forms from "@/styles/forms";
import AwesomeAlert from "react-native-awesome-alerts";

export default function AddGrade() {
    const [gradeName, setGradeName] = useState("");
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(true);

    const showAlert = (title: string, message: string, success: boolean) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertSuccess(success);
        setAlertVisible(true);
    };

    const handleAddGrade = async () => {
        if (!gradeName.trim()) {
            showAlert("Missing Field", "Please enter a grade name.", false);
            return;
        }
        try {
            await addDoc(collection(db, "grades"), {
                name: gradeName.trim(),
            });
            showAlert("Grade Added", "Grade added successfully!", true);
            setGradeName("");
        } catch (error) {
            console.error("Error adding grade: ", error);
            showAlert("Error", "Failed to add grade.", false);
        }
    };

    const handleAlertConfirm = () => {
        setAlertVisible(false);
    };

    return (
        <View style={forms.formContainer}>
            <Text style={forms.formTitle}>Add Grade</Text>
            <View style={forms.inputContainer}>
                <TextInput
                    style={forms.formInput}
                    placeholder="Grade Name"
                    value={gradeName}
                    onChangeText={setGradeName}
                />
            </View>
            <TouchableOpacity style={forms.formButton} onPress={handleAddGrade}>
                <Text style={forms.formButtonText}>Add Grade</Text>
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
