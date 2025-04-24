import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { db } from "@/config/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import forms from "@/styles/forms";

export default function ManageExams() {
  interface Exam {
    id: string;
    name: string;
    groupNum: number;
    date: string;
    studyLvel :string;
  }

  const [exams, setStudents] = useState<Exam[]>([]);

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "exams"));
      const studentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
        groupNum: doc.data().groupNum || 0,
        date: doc.data().date || "",
        studyLvel :doc.data().studyLevel || 0 
      })) as Exam[];
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching exams: ", error);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await deleteDoc(doc(db, "exams", id));
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Exam deleted successfully!",
        position: "center",
      });
      setStudents((prev) => prev.filter((student) => student.id !== id));
    } catch (error) {
      console.error("Error deleting Exam: ", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete Exam.",
        position: "center",
      });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <View style={forms.formContainer}>
      <Text style={forms.formTitle}>Manage Exams</Text>
      {exams.length === 0 ? (
        <Text style={forms.noDataText}>No exams exist</Text>
      ) : (
        <FlatList
          data={exams}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {}}>
              <View style={forms.listItem}>
                <View>
                  <Text style={forms.listItemTitle}>Exam Name : {item.name}</Text>
                  <Text>Group Number: {item.groupNum}</Text>
                  <Text>Date: {item.date}</Text>
                  <Text>Study Level:{item.studyLvel} </Text>
                </View>
                <TouchableOpacity
                  style={forms.deleteButton}
                  onPress={() => handleDeleteStudent(item.id)}
                >
                  <Text style={forms.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
