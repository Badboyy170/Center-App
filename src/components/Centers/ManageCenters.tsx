import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { db } from "@/config/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import forms from "@/styles/forms";

export default function ManageCenters() {
  interface Center {
    id: string;
    name: string;
    location: string;
  }

  const [centers, setCenters] = useState<Center[]>([]);

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

  const handleDeleteCenter = async (id: string) => {
    try {
      await deleteDoc(doc(db, "centers", id));
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Center deleted successfully!",
        position: "center",
      });
      setCenters((prev) => prev.filter((center) => center.id !== id));
    } catch (error) {
      console.error("Error deleting center: ", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete center.",
        position: "center",
      });
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  return (
    <View style={forms.formContainer}>
      <Text style={forms.formTitle}>Manage Centers</Text>
      {centers.length === 0 ? (
        <Text style={forms.noDataText}>No centers exist</Text>
      ) : (
        <FlatList
          data={centers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={forms.listItem}>
              <View>
                <Text style={forms.listItemTitle}>{item.name}</Text>
                <Text>Location: {item.location}</Text>
              </View>
              <TouchableOpacity
                style={forms.deleteButton}
                onPress={() => handleDeleteCenter(item.id)}
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