import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import forms from "@/styles/forms";
import { FaUser, FaCalendarAlt } from "react-icons/fa"; 
import ManageCenters from "./ManageCenters";

export default function AddCenter() {
    const [name, setName] = useState(""); 
    const [location, setLocation] = useState(""); 
    const [manager_name, setManagerName] = useState(""); 
    const [manager_phone, setManagerPhone] = useState(""); 

    const handleAddCenter = async () => {
        if (!name || !location) {
            Swal.fire("Error", "Please fill in all fields", "error");
            return;
        }

        try {
            const docRef = await addDoc(collection(db, "centers"), {
                name,
                location,
                manager_name,
                manager_phone
            });
            Swal.fire("Success", "Center added successfully!", "success");
            setName(""); // Reset the form
            setLocation("");
        } catch (error) {
            Swal.fire("Error", "Failed to add center", "error");
            console.error("Error adding document: ", error);
        }
    };

    return (
        <View style={forms.formContainer}>
            <Text style={forms.formTitle}>Add Center</Text>
            <View style={forms.inputContainer}>
                <FaUser style={forms.inputIcon} />
                <TextInput
                    style={forms.formInput}
                    placeholder="Center Name"
                    value={name}
                    onChangeText={setName}
                />
            </View>
            <View style={forms.inputContainer}>
                <FaCalendarAlt style={forms.inputIcon} />
                <TextInput
                    style={forms.formInput}
                    placeholder="Location"
                    value={location}
                    onChangeText={setLocation}
                />
            </View>
            <View style={forms.inputContainer}>
                <FaUser style={forms.inputIcon} />
                <TextInput
                    style={forms.formInput}
                    placeholder="Manager Name"
                    value={manager_name}
                    onChangeText={setManagerName}
                />
            </View>
            <View style={forms.inputContainer}>
                <FaUser style={forms.inputIcon} />
                <TextInput
                    style={forms.formInput}
                    placeholder="Manager Phone"
                    value={manager_phone}
                    onChangeText={setManagerPhone}
                />
            </View>
            <TouchableOpacity  onPress={handleAddCenter}>
                <Text >Add Center</Text>
            </TouchableOpacity>
        </View>
    );
}