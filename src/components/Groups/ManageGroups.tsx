import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, Dimensions, ScrollView } from "react-native";
import { db } from "@/config/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import Swal from "sweetalert2";
import forms from "@/styles/forms";
import { Picker } from '@react-native-picker/picker';

export default function ManageGroups() {
  interface Group {
    id: string;
    name: string;
    groupDay: string;
    startTime: string;
    endTime: string;
    centerId: string;
    gradeId: string;
  }

  const [Groups, setGroups] = useState<Group[]>([]);
  const [centers, setCenters] = useState<{ id: string; name: string }[]>([]);
  const [grades, setGrades] = useState<{ id: string; name: string }[]>([]);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [studentGroups, setStudentGroups] = useState<{ groupId: string; studentId: string }[]>([]);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editValues, setEditValues] = useState<Partial<Group>>({});
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [modalStudents, setModalStudents] = useState<{ id: string; name: string }[]>([]);
  const [studentSearch, setStudentSearch] = useState("");

  const fetchGroups = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "groups"));
      const GroupsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
        groupDay: doc.data().groupDay || "",
        startTime: doc.data().startTime || "",
        endTime: doc.data().endTime || "",
        centerId: doc.data().centerId || "",
        gradeId: doc.data().gradeId || "",
      })) as Group[];
      setGroups(GroupsData);
    } catch (error) {
      console.error("Error fetching groups: ", error);
    }
  };

  const fetchCenters = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "centers"));
      const centersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
      }));
      setCenters(centersData);
    } catch (error) {
      console.error("Error fetching centers: ", error);
    }
  };

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

  useEffect(() => {
    fetchGroups();
    fetchCenters();
    fetchGrades();
    // Fetch all students for lookup
    const fetchStudents = async () => {
      const querySnapshot = await getDocs(collection(db, "students"));
      setStudents(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || "",
        }))
      );
    };
    fetchStudents();

    // Fetch all studentGroups for group student counting
    const fetchStudentGroups = async () => {
      const querySnapshot = await getDocs(collection(db, "studentGroups"));
      setStudentGroups(
        querySnapshot.docs.map((doc) => ({
          groupId: doc.data().groupId,
          studentId: doc.data().studentId,
        }))
      );
    };
    fetchStudentGroups();
  }, []);

  const handleDeleteGroup = async (id: string) => {
    try {
      await deleteDoc(doc(db, "groups", id));
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Group deleted successfully!",
        position: "center",
      });
      setGroups((prev) => prev.filter((Group) => Group.id !== id));
    } catch (error) {
      console.error("Error deleting Group: ", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete Group.",
        position: "center",
      });
    }
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setEditValues({ ...group });
  };

  const handleSaveEdit = async () => {
    if (!editingGroup) return;
    try {
      await updateDoc(doc(db, "groups", editingGroup.id), {
        name: editValues.name,
        groupDay: editValues.groupDay,
        startTime: editValues.startTime,
        endTime: editValues.endTime,
        centerId: editValues.centerId,
        gradeId: editValues.gradeId,
      });
      setGroups((prev) =>
        prev.map((g) =>
          g.id === editingGroup.id
            ? { ...g, ...editValues }
            : g
        )
      );
      setEditingGroup(null);
      setEditValues({});
      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Group updated successfully!",
        position: "center",
      });
    } catch (error) {
      console.error("Error updating group: ", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update group.",
        position: "center",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    setEditValues({});
  };

  const handleShowStudents = async (groupId: string) => {
    try {
      const q = query(collection(db, "studentGroups"), where("groupId", "==", groupId));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        setModalStudents([]);
        setShowStudentsModal(true);
        return;
      }
      const studentIds = snapshot.docs.map((doc) => doc.data().studentId);
      const groupStudents = students.filter((s) => studentIds.includes(s.id));
      setModalStudents(groupStudents);
      setShowStudentsModal(true);
    } catch (error) {
      setModalStudents([]);
      setShowStudentsModal(true);
    }
  };

  const daysOfWeek = [
    { value: "", label: "Select Day" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
  ];

  useEffect(() => {
    fetchGroups();
    fetchCenters();
    fetchGrades();
  }, []);

  // Helper: get total students in a group
  const getTotalStudentsForGroup = (groupId: string) => {
    return studentGroups.filter(sg => sg.groupId === groupId).length;
  };

  // Responsive layout
  const windowWidth = Dimensions.get("window").width;
  const isSmallScreen = windowWidth < 600;
  const itemWidth = isSmallScreen ? windowWidth - 40 : (windowWidth - 80) / 4; // col-12 on phone, col-4 on desktop

  return (
    <View style={forms.formContainer}>
      <Text style={forms.formTitle}>Manage Groups</Text>
      {Groups.length === 0 ? (
        <Text style={forms.noDataText}>No Groups exist</Text>
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
            {Groups.map((item) => {
              const centerName =
                centers.find((center) => center.id === item.centerId)?.name || "Unknown";
              const gradeName =
                grades.find((grade) => grade.id === item.gradeId)?.name || "Unknown";
              const isEditing = editingGroup?.id === item.id;
              return (
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
                  <View style={{ flex: 1, width: "100%" }}>
                    {isEditing ? (
                      <>
                        <TextInput
                          style={forms.textInput}
                          value={editValues.name || ""}
                          onChangeText={(text) =>
                            setEditValues((prev) => ({ ...prev, name: text }))
                          }
                          placeholder="Group Name"
                        />
                        <View style={{ marginVertical: 4 }}>
                          <Text style={{ fontSize: 12, color: "#888" }}>Day of Group</Text>
                          <View style={{ borderWidth: 0 }}>
                            <Picker
                              selectedValue={editValues.groupDay}
                              onValueChange={(val) =>
                                setEditValues((prev) => ({ ...prev, groupDay: val }))
                              }
                              style={forms.picker}
                            >
                              {daysOfWeek.map((day) => (
                                <Picker.Item key={day.value} label={day.label} value={day.value} />
                              ))}
                            </Picker>
                          </View>
                        </View>
                        <TextInput
                          style={forms.textInput}
                          value={editValues.startTime || ""}
                          onChangeText={(text) =>
                            setEditValues((prev) => ({ ...prev, startTime: text }))
                          }
                          placeholder="Start Time"
                        />
                        <TextInput
                          style={forms.textInput}
                          value={editValues.endTime || ""}
                          onChangeText={(text) =>
                            setEditValues((prev) => ({ ...prev, endTime: text }))
                          }
                          placeholder="End Time"
                        />
                        <View style={{ marginVertical: 4 }}>
                          <Text style={{ fontSize: 12, color: "#888" }}>Center</Text>
                          <View style={{ borderWidth: 0 }}>
                            <Picker
                              selectedValue={editValues.centerId}
                              onValueChange={(val) =>
                                setEditValues((prev) => ({ ...prev, centerId: val }))
                              }
                              style={forms.picker}
                            >
                              <Picker.Item label="Select Center" value="" />
                              {centers.map((center) => (
                                <Picker.Item key={center.id} label={center.name} value={center.id} />
                              ))}
                            </Picker>
                          </View>
                        </View>
                        <View style={{ marginVertical: 4 }}>
                          <Text style={{ fontSize: 12, color: "#888" }}>Grade</Text>
                          <View style={{ borderWidth: 0 }}>
                            <Picker
                              selectedValue={editValues.gradeId}
                              onValueChange={(val) =>
                                setEditValues((prev) => ({ ...prev, gradeId: val }))
                              }
                              style={forms.picker}
                            >
                              <Picker.Item label="Select Grade" value="" />
                              {grades.map((grade) => (
                                <Picker.Item key={grade.id} label={grade.name} value={grade.id} />
                              ))}
                            </Picker>
                          </View>
                        </View>
                      </>
                    ) : (
                      <>
                        <Text style={forms.listItemTitle}>{item.name}</Text>
                        <Text>Day of Group: {item.groupDay}</Text>
                        <Text>Start Time: {item.startTime}</Text>
                        <Text>End Time: {item.endTime}</Text>
                        <Text>Center: {centerName}</Text>
                        <Text>Grade: {gradeName}</Text>
                        <Text>Total Students: {getTotalStudentsForGroup(item.id)}</Text>
                      </>
                    )}
                  </View>
                  <View style={{ flexDirection: "column", marginLeft: 8, width: "100%" }}>
                    {!isEditing && (
                      <TouchableOpacity
                        style={forms.formButton}
                        onPress={() => handleShowStudents(item.id)}
                      >
                        <Text style={forms.formButtonText}>Show Students</Text>
                      </TouchableOpacity>
                    )}
                    {isEditing ? (
                      <>
                        <TouchableOpacity
                          style={forms.saveButton}
                          onPress={handleSaveEdit}
                        >
                          <Text style={forms.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={forms.cancelButton}
                          onPress={handleCancelEdit}
                        >
                          <Text style={forms.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity
                          style={forms.editButton}
                          onPress={() => handleEditGroup(item)}
                        >
                          <Text style={forms.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={forms.deleteButton}
                          onPress={() => handleDeleteGroup(item.id)}
                        >
                          <Text style={forms.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
      <Modal
        visible={showStudentsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowStudentsModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <View style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            padding: 20,
            width: "90%",
            maxHeight: "80%"
          }}>
            <Text style={[forms.formTitle, { color: "#333" }]}>Group Students</Text>
            <TextInput
              style={[forms.formInput, { marginBottom: 10 }]}
              placeholder="Search student..."
              value={studentSearch}
              onChangeText={setStudentSearch}
            />
            <View style={{ maxHeight: 300 }}>
              {modalStudents.length === 0 ? (
                <Text style={{ color: "#888", textAlign: "center" }}>No students in this group.</Text>
              ) : (
                <View>
                  <View style={{ flexDirection: "row", borderBottomWidth: 1, borderColor: "#ccc", paddingBottom: 4, marginBottom: 6 }}>
                    <Text style={{ flex: 1, fontWeight: "bold" }}>#</Text>
                    <Text style={{ flex: 4, fontWeight: "bold" }}>Name</Text>
                  </View>
                  {modalStudents
                    .filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()))
                    .map((student, idx) => (
                      <View key={student.id} style={{ flexDirection: "row", paddingVertical: 4, borderBottomWidth: 1, borderColor: "#eee" }}>
                        <Text style={{ flex: 1 }}>{idx + 1}</Text>
                        <Text style={{ flex: 4 }}>{student.name}</Text>
                      </View>
                    ))}
                </View>
              )}
            </View>
            <TouchableOpacity
              style={[forms.formButton, { marginTop: 16 }]}
              onPress={() => setShowStudentsModal(false)}
            >
              <Text style={forms.formButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
