import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import forms from "@/styles/forms";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

export default function AddCenter() {
    const [name, setName] = useState(""); 
    const [location, setLocation] = useState(""); 
    const [manager_name, setManagerName] = useState(""); 
    const [manager_phone, setManagerPhone] = useState(""); 
    const [iconInfo, setIconInfo] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleAddCenter = async () => {
        if (!name || !location) {
            setIconInfo({ type: "error", message: "Please fill in all fields" });
            setTimeout(() => setIconInfo(null), 2000);
            return;
        }

        try {
            await addDoc(collection(db, "centers"), {
                name,
                location,
                manager_name,
                manager_phone
            });
            setIconInfo({ type: "success", message: "Center added successfully!" });
            setTimeout(() => setIconInfo(null), 2000);
            setName(""); // Reset the form
            setLocation("");
        } catch (error) {
            setIconInfo({ type: "error", message: "Failed to add center" });
            setTimeout(() => setIconInfo(null), 2000);
            console.error("Error adding document: ", error);
        }
    };

    return (
        <View style={forms.formContainer}>
            <Text style={forms.formTitle}>Add Center</Text>
            <View style={forms.inputContainer}>
                <Icon name="user" style={forms.inputIcon} />
                <TextInput
                    style={forms.formInput}
                    placeholder="Center Name"
                    value={name}
                    onChangeText={setName}
                />
            </View>
            <View style={forms.inputContainer}>
                <Icon name="map-marker" style={forms.inputIcon} />
                <TextInput
                    style={forms.formInput}
                    placeholder="Location"
                    value={location}
                    onChangeText={setLocation}
                />
            </View>
            <View style={forms.inputContainer}>
                <Icon name="user" style={forms.inputIcon} />
                <TextInput
                    style={forms.formInput}
                    placeholder="Manager Name"
                    value={manager_name}
                    onChangeText={setManagerName}
                />
            </View>
            <View style={forms.inputContainer}>
                <Icon name="phone" style={forms.inputIcon} />
                <TextInput
                    style={forms.formInput}
                    placeholder="Manager Phone"
                    value={manager_phone}
                    onChangeText={setManagerPhone}
                />
            </View>
            <TouchableOpacity style={forms.formButton} onPress={handleAddCenter}>
                <Text style={forms.formButtonText}>Add Center</Text>
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
                    <MaterialIcon
                        name={iconInfo.type === "success" ? "check-circle" : "close-circle"}
                        size={28}
                        color={iconInfo.type === "success" ? "#4BB543" : "#e74c3c"}
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