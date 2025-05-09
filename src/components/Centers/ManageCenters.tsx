import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Dimensions, ScrollView } from "react-native";
import { db } from "@/config/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import forms from "@/styles/forms";
import AwesomeAlert from "react-native-awesome-alerts";

export default function ManageCenters() {
  interface Center {
    id: string;
    name: string;
    location: string;
  }

  const [centers, setCenters] = useState<Center[]>([]);
  const [editingCenter, setEditingCenter] = useState<Center | null>(null);
  const [editValues, setEditValues] = useState<Partial<Center>>({});
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSuccess, setAlertSuccess] = useState(true);
  const [groups, setGroups] = useState<{ id: string; centerId: string }[]>([]);
  const [studentGroups, setStudentGroups] = useState<{ groupId: string; studentId: string }[]>([]);

  const showAlert = (title: string, message: string, success: boolean) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertSuccess(success);
    setAlertVisible(true);
  };

  const fetchCenters = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "centers"));
      const centersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
        location: doc.data().location || "",
      })) as Center[];
      setCenters(centersData);
    } catch (error) {
      console.error("Error fetching centers: ", error);
    }
  };


  const fetchGroupsAndStudentGroups = async () => {
    try {
      const groupsSnap = await getDocs(collection(db, "groups"));
      setGroups(
        groupsSnap.docs.map((doc) => ({
          id: doc.id,
          centerId: doc.data().centerId || "",
        }))
      );
      const studentGroupsSnap = await getDocs(collection(db, "studentGroups"));
      setStudentGroups(
        studentGroupsSnap.docs.map((doc) => ({
          groupId: doc.data().groupId,
          studentId: doc.data().studentId,
        }))
      );
    } catch (error) {
      
    }
  };

  useEffect(() => {
    fetchCenters();
    fetchGroupsAndStudentGroups();
  }, []);

  const handleDeleteCenter = async (id: string) => {
    try {
      await deleteDoc(doc(db, "centers", id));
      showAlert("Deleted", "Center deleted successfully!", true);
      setCenters((prev) => prev.filter((center) => center.id !== id));
    } catch (error) {
      console.error("Error deleting center: ", error);
      showAlert("Error", "Failed to delete center.", false);
    }
  };

  const handleEditCenter = (center: Center) => {
    setEditingCenter(center);
    setEditValues({ ...center });
  };

  const handleSaveEdit = async () => {
    if (!editingCenter) return;
    try {
      await updateDoc(doc(db, "centers", editingCenter.id), {
        name: editValues.name,
        location: editValues.location,
      });
      setCenters((prev) =>
        prev.map((c) =>
          c.id === editingCenter.id ? { ...c, ...editValues } : c
        )
      );
      setEditingCenter(null);
      setEditValues({});
      showAlert("Updated", "Center updated successfully!", true);
    } catch (error) {
      showAlert("Error", "Failed to update center.", false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCenter(null);
    setEditValues({});
  };


  const windowWidth = Dimensions.get("window").width;
  const isSmallScreen = windowWidth < 600;
  const itemWidth = isSmallScreen ? windowWidth - 40 : (windowWidth - 80) / 4; 

  
  const getTotalStudentsForCenter = (centerId: string) => {
  
    const groupIds = groups.filter(g => g.centerId === centerId).map(g => g.id);
    
    const studentIds = studentGroups
      .filter(sg => groupIds.includes(sg.groupId))
      .map(sg => sg.studentId);
   
    return Array.from(new Set(studentIds)).length;
  };

  return (
    <View style={forms.formContainer}>
      <Text style={forms.formTitle}>Manage Centers</Text>
      {centers.length === 0 ? (
        <Text style={forms.noDataText}>No centers exist</Text>
      ) : (
        <ScrollView horizontal={false} style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: isSmallScreen ? "column" : "row",
              flexWrap: "wrap",
              justifyContent: isSmallScreen ? "flex-start" : "flex-start",
              alignItems: isSmallScreen ? "stretch" : "flex-start",
            }}
          >
            {centers.map((item) => (
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
                {editingCenter?.id === item.id ? (
                  <>
                    <TextInput
                      style={[forms.textInput, { width: "100%", marginBottom: 8 }]}
                      value={editValues.name || ""}
                      onChangeText={(text) =>
                        setEditValues((prev) => ({ ...prev, name: text }))
                      }
                      placeholder="Center Name"
                    />
                    <TextInput
                      style={[forms.textInput, { width: "100%", marginBottom: 8 }]}
                      value={editValues.location || ""}
                      onChangeText={(text) =>
                        setEditValues((prev) => ({ ...prev, location: text }))
                      }
                      placeholder="Location"
                    />
                    <TouchableOpacity
                      style={[forms.saveButton, { width: "100%", marginBottom: 8 }]}
                      onPress={handleSaveEdit}
                    >
                      <Text style={forms.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[forms.cancelButton, { width: "100%" }]}
                      onPress={handleCancelEdit}
                    >
                      <Text style={forms.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={{ width: "100%" }}>
                      <Text style={forms.listItemTitle}>{item.name}</Text>
                      <Text>Location: {item.location}</Text>
                      <Text>
                        Total Students: {getTotalStudentsForCenter(item.id)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[forms.editButton, { width: "100%", marginTop: 8 }]}
                      onPress={() => handleEditCenter(item)}
                    >
                      <Text style={forms.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[forms.deleteButton, { width: "100%", marginTop: 8 }]}
                      onPress={() => handleDeleteCenter(item.id)}
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
        onConfirmPressed={() => setAlertVisible(false)}
        onDismiss={() => setAlertVisible(false)}
      />
    </View>
  );
}