import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { db } from "@/config/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import forms from "@/styles/forms";

export default function ManageGroups() {
  interface Group {
    id: string;
    name: string;
    classRoom: string;
    startTime: string;
    endTime: string;
    term: string;
    centerId: string;
    groupNumber:string;
    studyLevel:string;
  }

  const [Groups, setGroups] = useState<Group[]>([]);
  const [centers, setCenters] = useState<{ id: string; name: string }[]>([]);

  const fetchGroups = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "groups"));
      const GroupsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
        classRoom: doc.data().classRoom || "",
        startTime: doc.data().startTime || "",
        endTime: doc.data().endTime || "",
        term: doc.data().term || "",
        centerId: doc.data().centerId || "",
        groupNumber:doc.data().groupNumber  || "" ,
        studyLevel:doc.data().studyLevel || ""
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

  useEffect(() => {
    fetchGroups();
    fetchCenters();
  }, []);

  return (
    <View style={forms.formContainer}>
      <Text style={forms.formTitle}>Manage Groups</Text>
      {Groups.length === 0 ? (
        <Text style={forms.noDataText}>No Groups exist</Text>
      ) : (
        <FlatList
          data={Groups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const centerName =
              centers.find((center) => center.id === item.centerId)?.name || "Unknown";
            return (
              <View style={forms.listItem}>
                <View>
                  <Text style={forms.listItemTitle}>{item.name}</Text>
                  <Text>Day of Group: {item.classRoom}</Text>
                  <Text>Start Time: {item.startTime}</Text>
                  <Text>End Time: {item.endTime}</Text>
                  <Text>Group Number :{item.groupNumber}</Text>
                  <Text>Study Level : {item.studyLevel}</Text>
                  <Text>Term: {item.term}</Text>
                  <Text>Center: {centerName}</Text>
                </View>
                <TouchableOpacity
                  style={forms.deleteButton}
                  onPress={() => handleDeleteGroup(item.id)}
                >
                  <Text style={forms.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}
