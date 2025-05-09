import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { db } from "@/config/firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import Swal from "sweetalert2";
import forms from "@/styles/forms";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function AddStudentToGroup() {
    const [grades, setGrades] = useState<{ id: string; name: string }[]>([]);
    const [selectedGrade, setSelectedGrade] = useState("");
    const [students, setStudents] = useState<{ id: string; name: string; grade: string }[]>([]);
    const [groups, setGroups] = useState<{ id: string; name: string; gradeId: string }[]>([]);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [iconInfo, setIconInfo] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

    useEffect(() => {
        const fetchGrades = async () => {
            const querySnapshot = await getDocs(collection(db, "grades"));
            setGrades(
                querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name || "",
                }))
            );
        };
        fetchGrades();
    }, []);

    useEffect(() => {
        if (!selectedGrade) {
            setStudents([]);
            setSelectedStudent("");
            return;
        }
        const fetchStudents = async () => {
            const querySnapshot = await getDocs(collection(db, "students"));
            setStudents(
                querySnapshot.docs
                    .map((doc) => ({
                        id: doc.id,
                        name: doc.data().name || "",
                        grade: doc.data().grade || "",
                    }))
                    .filter((student) => student.grade === selectedGrade)
            );
        };
        fetchStudents();
        setSelectedStudent("");
    }, [selectedGrade]);

    useEffect(() => {
        const fetchGroups = async () => {
            const querySnapshot = await getDocs(collection(db, "groups"));
            setGroups(
                querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name || "",
                    gradeId: doc.data().gradeId || "",
                }))
            );
        };
        fetchGroups();
    }, []);

    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectedStudentObj = students.find((s) => s.id === selectedStudent);
    const studentGradeId = selectedStudentObj?.grade || "";

    // Filter groups by student's grade
    const filteredGroups = groups.filter(
        (group) => !studentGradeId || group.gradeId === studentGradeId
    );

    const handleAddToGroups = async () => {
        if (!selectedStudent || selectedGroups.length === 0) {
            setIconInfo({ type: "error", message: "Please select a student and at least one group." });
            setTimeout(() => setIconInfo(null), 2000);
            return;
        }
        try {
            const alreadyAssigned: string[] = [];
            const toAssign: string[] = [];
            for (const groupId of selectedGroups) {
                const q = query(
                    collection(db, "studentGroups"),
                    where("studentId", "==", selectedStudent),
                    where("groupId", "==", groupId)
                );
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    alreadyAssigned.push(groupId);
                } else {
                    toAssign.push(groupId);
                }
            }
            if (toAssign.length === 0) {
                setIconInfo({ type: "info", message: "Student is already in all selected group(s)." });
                setTimeout(() => setIconInfo(null), 2000);
                return;
            }
            await Promise.all(
                toAssign.map((groupId) =>
                    addDoc(collection(db, "studentGroups"), {
                        studentId: selectedStudent,
                        groupId,
                    })
                )
            );
            let msg = "Student added to group(s) successfully!";
            if (alreadyAssigned.length > 0) {
                msg += `\nSome groups were skipped because the student is already in them.`;
            }
            setIconInfo({ type: "success", message: msg });
            setTimeout(() => setIconInfo(null), 2000);
            setSelectedStudent("");
            setSelectedGroups([]);
        } catch (error) {
            console.error("Error adding student to group: ", error);
            setIconInfo({ type: "error", message: "Failed to add student to group(s)." });
            setTimeout(() => setIconInfo(null), 2000);
        }
    };

    const toggleGroupSelection = (groupId: string) => {
        setSelectedGroups((prev) =>
            prev.includes(groupId)
                ? prev.filter((id) => id !== groupId)
                : [...prev, groupId]
        );
    };

    return (
        <ScrollView contentContainerStyle={forms.formContainer}>
            <Text style={forms.formTitle}>Add Student to Group</Text>
            <View style={forms.inputContainer}>
                <Text style={{ marginRight: 10, fontWeight: "bold" }}>Grade:</Text>
                <Picker
                    selectedValue={selectedGrade}
                    onValueChange={setSelectedGrade}
                    style={forms.picker}
                >
                    <Picker.Item label="Select Grade" value="" />
                    {grades.map((grade) => (
                        <Picker.Item key={grade.id} label={grade.name} value={grade.id} />
                    ))}
                </Picker>
            </View>
            <TextInput
        style={forms.searchInput}
                placeholder="Search student by name..."
                value={search}
                onChangeText={setSearch}
                editable={!!selectedGrade}
            />
            <View style={forms.inputContainer}>
                <Text style={{ marginRight: 10, fontWeight: "bold" }}>Student:</Text>
                <Picker
                    selectedValue={selectedStudent}
                    onValueChange={setSelectedStudent}
                    style={forms.picker}
                    enabled={!!selectedGrade}
                >
                    <Picker.Item label="Select Student" value="" />
                    {filteredStudents.map((student) => (
                        <Picker.Item key={student.id} label={student.name} value={student.id} />
                    ))}
                </Picker>
            </View>
            <View style={forms.inputContainer}>
                <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Groups:</Text>
            </View>
            <View style={{ marginBottom: 20 }}>
                {filteredGroups.map((group) => (
                    <TouchableOpacity
                        key={group.id}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 8,
                        }}
                        onPress={() => toggleGroupSelection(group.id)}
                    >
                        <View
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: 4,
                                borderWidth: 1,
                                borderColor: "#007bff",
                                backgroundColor: selectedGroups.includes(group.id)
                                    ? "#007bff"
                                    : "#fff",
                                marginRight: 10,
                            }}
                        />
                        <Text style={{ color: "#fff" }}>{group.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={forms.formButton} onPress={handleAddToGroups}>
                <Text style={forms.formButtonText}>Add to Group(s)</Text>
            </TouchableOpacity>
            {iconInfo && (
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 16,
                    alignSelf: "center",
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
                    <Icon
                        name={
                            iconInfo.type === "success"
                                ? "check-circle"
                                : iconInfo.type === "error"
                                ? "close-circle"
                                : "information"
                        }
                        size={28}
                        color={
                            iconInfo.type === "success"
                                ? "#4BB543"
                                : iconInfo.type === "error"
                                ? "#e74c3c"
                                : "#f1c40f"
                        }
                        style={{ marginRight: 12 }}
                    />
                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16, maxWidth: 250, textAlign: "center" }}>
                        {iconInfo.message}
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}
