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
    classRoom: number;
    grade: string;
  }

  const [Groups, setGroups] = useState<Group[]>([]);

  const fetchGroups = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "groups"));
      const GroupsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
        classRoom: doc.data().classRoom || 0,
        grade: doc.data().grade || "",
      })) as Group[];
      setGroups(GroupsData);
    } catch (error) {
      console.error("Error fetching groups: ", error);
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
          renderItem={({ item }) => (
            <View style={forms.listItem}>
              <View>
                <Text style={forms.listItemTitle}>{item.name}</Text>
                <Text>ClassRoom: {item.classRoom}</Text>
                <Text>Grade: {item.grade}</Text>
              </View>
              <TouchableOpacity
                style={forms.deleteButton}
                onPress={() => handleDeleteGroup(item.id)}
              >
                <Text style={forms.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
