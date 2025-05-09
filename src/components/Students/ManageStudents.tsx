import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, Linking, Dimensions, ScrollView } from "react-native";
import { db } from "@/config/firebase";
import { collection, getDocs, deleteDoc, doc, query, where, updateDoc } from "firebase/firestore";
import forms from "@/styles/forms";
import { Picker } from '@react-native-picker/picker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AwesomeAlert from "react-native-awesome-alerts";

// Add a simple StarRating component for selecting 0-5 stars
function StarRating({ value, onChange, editable = true }: { value: number; onChange: (v: number) => void; editable?: boolean }) {
  return (
    <View style={{ flexDirection: "row", marginVertical: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => editable && onChange(star)}
          disabled={!editable}
        >
          <Text style={{ fontSize: 20, color: star <= value ? "#FFD700" : "#ccc", marginHorizontal: 2 }}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ManageStudents() {
  interface Student {
    id: string;
    name: string;
    studentPhone: string;
    parentPhone: string;
    grade: string;
    generalRate?: number; // now number 0-5
  }

  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [grades, setGrades] = useState<{ id: string; name: string }[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editValues, setEditValues] = useState<Partial<Student>>({});
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrStudentId, setQrStudentId] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSuccess, setAlertSuccess] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const showAlert = (title: string, message: string, success: boolean) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertSuccess(success);
    setAlertVisible(true);
  };

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      const studentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
        studentPhone: doc.data().studentPhone || "",
        parentPhone: doc.data().parentPhone || "",
        grade: doc.data().grade || "",
        generalRate: typeof doc.data().generalRate === "number" ? doc.data().generalRate : 0,
      })) as Student[];
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students: ", error);
    }
  };

  const fetchGroups = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "groups"));
      setGroups(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || "",
        }))
      );
    } catch (error) {
      console.error("Error fetching groups: ", error);
    }
  };

  const fetchGrades = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "grades"));
      setGrades(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || "",
        }))
      );
    } catch (error) {
      console.error("Error fetching grades: ", error);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await deleteDoc(doc(db, "students", id));
      showAlert("Deleted", "Student deleted successfully!", true);
      setStudents((prev) => prev.filter((student) => student.id !== id));
    } catch (error) {
      console.error("Error deleting student: ", error);
      showAlert("Error", "Failed to delete student.", false);
    }
  };

  const handleShowGroups = async (studentId: string) => {
    try {
      const q = query(collection(db, "studentGroups"), where("studentId", "==", studentId));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        showAlert("No Groups", "This student is not in any group.", false);
        return;
      }
      const groupIds = snapshot.docs.map((doc) => doc.data().groupId);
      const groupNames = groups
        .filter((g) => groupIds.includes(g.id))
        .map((g) => g.name)
        .join(", ");
      showAlert("Student Groups", groupNames || "No group names found.", true);
    } catch (error) {
      showAlert("Error", "Failed to fetch student groups.", false);
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setEditValues({ ...student });
  };

  const handleSaveEdit = async () => {
    if (!editingStudent) return;
    try {
      await updateDoc(doc(db, "students", editingStudent.id), {
        name: editValues.name,
        studentPhone: editValues.studentPhone,
        parentPhone: editValues.parentPhone,
        grade: editValues.grade,
        generalRate: editValues.generalRate ?? 0,
      });
      setStudents((prev) =>
        prev.map((s) =>
          s.id === editingStudent.id ? { ...s, ...editValues } : s
        )
      );
      setEditingStudent(null);
      setEditValues({});
      showAlert("Updated", "Student updated successfully!", true);
    } catch (error) {
      showAlert("Error", "Failed to update student.", false);
    }
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setEditValues({});
  };

  const handleSelectStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedStudents.length === 0) return;
    try {
      for (const id of selectedStudents) {
        await deleteDoc(doc(db, "students", id));
      }
      setStudents((prev) => prev.filter((student) => !selectedStudents.includes(student.id)));
      setSelectedStudents([]);
      showAlert("Deleted", "Selected students deleted successfully!", true);
    } catch (error) {
      showAlert("Error", "Failed to delete selected students.", false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchGroups();
    fetchGrades();
  }, []);

  // Live search filter
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  // Responsive item width
  const windowWidth = Dimensions.get("window").width;
  const isSmallScreen = windowWidth < 600;
  const itemWidth = isSmallScreen ? windowWidth - 20 : 500;

  return (
    <View style={forms.formContainer}>
      <Text style={forms.formTitle}>Manage Students</Text>
      <TextInput
        style={forms.searchInput}
        placeholder="Search by name..."
        value={search}
        onChangeText={setSearch}
      />
      {selectedStudents.length > 0 && (
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <Text style={{ color: "#007bff", fontWeight: "bold", marginRight: 10 }}>
            Selected: {selectedStudents.length}
          </Text>
          <TouchableOpacity
            style={[forms.deleteButton, { minWidth: 100 }]}
            onPress={handleBulkDelete}
          >
            <Text style={forms.deleteButtonText}>Delete Selected</Text>
          </TouchableOpacity>
        </View>
      )}
      {filteredStudents.length === 0 ? (
        <Text style={forms.noDataText}>No students exist</Text>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
          horizontal={false}
          renderItem={({ item }) => (
            <ScrollView horizontal showsHorizontalScrollIndicator>
              <View
                style={[
                  forms.listItem,
                  {
                    width: itemWidth,
                    minWidth: isSmallScreen ? undefined : 400,
                    maxWidth: "100%",
                    flexDirection: isSmallScreen ? "column" : "row",
                    alignItems: isSmallScreen ? "flex-start" : "center",
                    backgroundColor: selectedStudents.includes(item.id) ? "#e3f2fd" : "#fff",
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => handleSelectStudent(item.id)}
                  style={{
                    marginRight: 10,
                    marginBottom: isSmallScreen ? 8 : 0,
                    alignSelf: isSmallScreen ? "flex-start" : "center",
                  }}
                >
                  <Icon
                    name={
                      selectedStudents.includes(item.id)
                        ? "checkbox-marked"
                        : "checkbox-blank-outline"
                    }
                    size={24}
                    color={selectedStudents.includes(item.id) ? "#007bff" : "#bbb"}
                  />
                </TouchableOpacity>
                <View style={{ flex: 1, width: "100%" }}>
                  {editingStudent?.id === item.id ? (
                    <>
                      <TextInput
                        style={[forms.textInput, { width: "100%" }]}
                        value={editValues.name || ""}
                        onChangeText={(text) =>
                          setEditValues((prev) => ({ ...prev, name: text }))
                        }
                        placeholder="Name"
                      />
                      <TextInput
                        style={[forms.textInput, { width: "100%" }]}
                        value={editValues.studentPhone || ""}
                        onChangeText={(text) =>
                          setEditValues((prev) => ({ ...prev, studentPhone: text }))
                        }
                        placeholder="Student Phone"
                        keyboardType="phone-pad"
                      />
                      <TextInput
                        style={[forms.textInput, { width: "100%" }]}
                        value={editValues.parentPhone || ""}
                        onChangeText={(text) =>
                          setEditValues((prev) => ({ ...prev, parentPhone: text }))
                        }
                        placeholder="Parent Phone"
                        keyboardType="phone-pad"
                      />
                      <View style={{ marginVertical: 4 }}>
                        <Text style={{ fontSize: 12, color: "#888" }}>Grade</Text>
                        <View style={{ borderWidth: 0 }}>
                          <Picker
                            selectedValue={editValues.grade}
                            onValueChange={(val) =>
                              setEditValues((prev) => ({ ...prev, grade: val }))
                            }
                            style={[forms.picker, { width: "100%" }]}
                          >
                            <Picker.Item label="Select Grade" value="" />
                            {grades.map((grade) => (
                              <Picker.Item key={grade.id} label={grade.name} value={grade.id} />
                            ))}
                          </Picker>
                        </View>
                      </View>
                      <TextInput
                        style={[forms.textInput, { width: "100%" }]}
                        value={editValues.generalRate || ""}
                        onChangeText={(text) =>
                          setEditValues((prev) => ({ ...prev, generalRate: text }))
                        }
                        placeholder="General Rate"
                      />
                      <View style={{ marginVertical: 4 }}>
                        <Text style={{ fontSize: 12, color: "#888" }}>General Rate</Text>
                        <StarRating
                          value={typeof editValues.generalRate === "number" ? editValues.generalRate : 0}
                          onChange={(v) => setEditValues((prev) => ({ ...prev, generalRate: v }))}
                        />
                      </View>
                    </>
                  ) : (
                    <>
                      <Text style={forms.listItemTitle}>{item.name}</Text>
                      <Text>
                        Student Phone: {item.studentPhone}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text>Parent Phone: {item.parentPhone}</Text>
                        {item.parentPhone ? (
                          <TouchableOpacity
                            onPress={() => Linking.openURL(`tel:${item.parentPhone}`)}
                            style={{ marginLeft: 8 }}
                          >
                            <Icon name="phone" size={18} color="#007bff" />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                      <Text>Grade: {grades.find((g) => g.id === item.grade)?.name || item.grade}</Text>
                      <Text>General Rate: {item.generalRate || "-"}</Text>
                      <Text style={{ flexDirection: "row", alignItems: "center" }}>
                        General Rate:{" "}
                        <StarRating value={item.generalRate ?? 0} onChange={() => {}} editable={false} />
                      </Text>
                    </>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: isSmallScreen ? "column" : "column",
                    flexWrap: "nowrap",
                    width: isSmallScreen ? "100%" : undefined,
                    marginTop: isSmallScreen ? 10 : 0,
                    justifyContent: isSmallScreen ? "flex-start" : "flex-end",
                  }}
                >
                  {editingStudent?.id === item.id ? (
                    <>
                      <TouchableOpacity
                        style={[forms.saveButton, { width: isSmallScreen ? "100%" : undefined, marginRight: 0, marginBottom: isSmallScreen ? 8 : 0 }]}
                        onPress={handleSaveEdit}
                      >
                        <Text style={forms.saveButtonText}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[forms.cancelButton, { width: isSmallScreen ? "100%" : undefined, marginLeft: 0, marginBottom: isSmallScreen ? 8 : 0 }]}
                        onPress={handleCancelEdit}
                      >
                        <Text style={forms.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={[forms.editButton, { width: isSmallScreen ? "100%" : undefined, marginBottom: isSmallScreen ? 8 : 8 }]}
                        onPress={() => handleEditStudent(item)}
                      >
                        <Text style={forms.editButtonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[forms.formButton, { width: isSmallScreen ? "100%" : undefined, marginBottom: isSmallScreen ? 8 : 8 }]}
                        onPress={() => handleShowGroups(item.id)}
                      >
                        <Text style={forms.formButtonText}>Show Groups</Text>
                      </TouchableOpacity>
                      {/* <TouchableOpacity
                        style={[forms.formButton, { width: isSmallScreen ? "100%" : undefined, marginBottom: isSmallScreen ? 8 : 8 }]}
                        onPress={() => {
                          setQrStudentId(item.id);
                          setQrModalVisible(true);
                        }}
                      >
                        <Text style={forms.formButtonText}>Show QR</Text>
                      </TouchableOpacity> */}
                      <TouchableOpacity
                        style={[forms.deleteButton, { width: isSmallScreen ? "100%" : undefined }]}
                        onPress={() => handleDeleteStudent(item.id)}
                      >
                        <Text style={forms.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </ScrollView>
          )}
        />
      )}
      {/* QR Modal
      <Modal
        visible={qrModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setQrModalVisible(false)}
      > */}
        {/* <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <View style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            padding: 20,
            alignItems: "center"
          }}>
            <Text style={[forms.formTitle, { color: "#333" }]}>Student QR Code</Text>
            {qrStudentId && (
              <View style={{ backgroundColor: "#fff", padding: 10, borderRadius: 8, marginVertical: 16 }}>
                <QRCode value={qrStudentId} size={200} />
              </View>
            )}
            <TouchableOpacity
              style={[forms.formButton, { marginTop: 10 }]}
              onPress={() => setQrModalVisible(false)}
            >
              <Text style={forms.formButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View> */}
      {/* </Modal> */}
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
        onConfirmPressed={() => setAlertVisible(false)}
        onDismiss={() => setAlertVisible(false)}
      />
    </View>
  );
}
