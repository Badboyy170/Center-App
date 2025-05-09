import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Dimensions, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { db } from "@/config/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import forms from "@/styles/forms";
import AwesomeAlert from "react-native-awesome-alerts";

interface Grade {
    id: string;
    name: string;
}

export default function ManageGrades() {
    const [grades, setGrades] = useState<Grade[]>([]);
    const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
    const [newName, setNewName] = useState("");
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(true);

    // Responsive layout
    const windowWidth = Dimensions.get("window").width;
    const isSmallScreen = windowWidth < 600;
    const itemWidth = isSmallScreen ? windowWidth - 40 : (windowWidth - 80) / 4; // col-12 on phone, col-4 on desktop

    const showAlert = (title: string, message: string, success: boolean) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertSuccess(success);
        setAlertVisible(true);
    };

    const fetchGrades = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "grades"));
            const gradesData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name || "",
            })) as Grade[];
            setGrades(gradesData);
        } catch (error) {
            console.error("Error fetching grades: ", error);
        }
    };

    const handleDeleteGrade = async (id: string) => {
        showAlert("Delete Grade", "Are you sure you want to delete this grade?", false);
        setTimeout(async () => {
            try {
                await deleteDoc(doc(db, "grades", id));
                showAlert("Deleted", "Grade deleted successfully!", true);
                setGrades((prev) => prev.filter((grade) => grade.id !== id));
            } catch (error) {
                console.error("Error deleting grade: ", error);
                showAlert("Error", "Failed to delete grade.", false);
            }
        }, 800);
    };

    const handleEditGrade = (grade: Grade) => {
        setEditingGrade(grade);
        setNewName(grade.name);
    };

    const handleSaveEdit = async () => {
        if (editingGrade) {
            try {
                await updateDoc(doc(db, "grades", editingGrade.id), { name: newName });
                showAlert("Updated", "Grade updated successfully!", true);
                setGrades((prev) =>
                    prev.map((grade) =>
                        grade.id === editingGrade.id ? { ...grade, name: newName } : grade
                    )
                );
                setEditingGrade(null);
                setNewName("");
            } catch (error) {
                console.error("Error updating grade: ", error);
                showAlert("Error", "Failed to update grade.", false);
            }
        }
    };

    const handleAlertConfirm = () => {
        setAlertVisible(false);
    };

    useEffect(() => {
        fetchGrades();
    }, []);

    return (
        <View style={forms.formContainer}>
            <Text style={forms.formTitle}>Manage Grades</Text>
            {grades.length === 0 ? (
                <Text style={forms.noDataText}>No grades exist</Text>
            ) : (
                <ScrollView horizontal={false} style={{ flex: 1 }}>
                    <View
                        style={{
                            flexDirection: isSmallScreen ? "column" : "row",
                            flexWrap: "wrap",
                            justifyContent: isSmallScreen ? "flex-start" : "flex-start",
                            alignItems: isSmallScreen ? "stretch" : "flex-start",
                            overflow: "scroll",
                        }}
                    >
                        {grades.map((item) => (
                            <View
                                key={item.id}
                                style={[
                                    forms.listItem,
                                    {
                                        width: itemWidth,
                                        minWidth: isSmallScreen ? undefined : 220,
                                        maxWidth: isSmallScreen ? "100%" : undefined,
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        backgroundColor: "#fff",
                                        marginRight: isSmallScreen ? 0 : 10,
                                        marginBottom: 10,
                                        alignSelf: isSmallScreen ? "stretch" : "flex-start",
                                    },
                                ]}
                            >
                                {editingGrade?.id === item.id ? (
                                    <>
                                        <TextInput
                                            style={forms.textInput}
                                            value={newName}
                                            onChangeText={setNewName}
                                        />
                                        <TouchableOpacity
                                            style={forms.saveButton}
                                            onPress={handleSaveEdit}
                                        >
                                            <Text style={forms.saveButtonText}>Save</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={forms.cancelButton}
                                            onPress={() => setEditingGrade(null)}
                                        >
                                            <Text style={forms.cancelButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        <Text style={forms.listItemTitle}>{item.name}</Text>
                                        <TouchableOpacity
                                            style={forms.editButton}
                                            onPress={() => handleEditGrade(item)}
                                        >
                                            <Text style={forms.editButtonText}>Edit</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={forms.deleteButton}
                                            onPress={() => handleDeleteGrade(item.id)}
                                        >
                                            <Text style={forms.deleteButtonText}>Delete</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}
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
