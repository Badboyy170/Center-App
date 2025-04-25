import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { db } from "@/config/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import forms from "@/styles/forms";
import { router } from "expo-router";

export default function ManageExams() {
  interface Exam {
    id: string;
    name: string;
    groupNum: number;
    date: string;
    studyLevel: string;
  }

  const [exams, setExams] = useState<Exam[]>([]);

  const fetchExams = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "exams"));
      const examsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
        groupNum: doc.data().groupNum || 0,
        date: doc.data().date || "",
        studyLevel: doc.data().studyLevel || "",
      })) as Exam[];
      setExams(examsData);
    } catch (error) {
      console.error("Error fetching exams: ", error);
    }
  };

  const handleDeleteExam = async (id: string) => {
    try {
      await deleteDoc(doc(db, "exams", id));
      Swal.fire({ icon: "success", title: "Deleted", text: "Exam deleted successfully!" });
      setExams((prev) => prev.filter((exam) => exam.id !== id));
    } catch (error) {
      console.error("Error deleting Exam: ", error);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to delete Exam." });
    }
  };

  useEffect(() => {
    fetchExams();
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
            <TouchableOpacity onPress={() => router.push({ pathname: "/ExamDetails", params: { id: item.id } })}>
              <View style={forms.listItem}>
                <View>
                  <Text style={forms.listItemTitle}>Exam Name: {item.name}</Text>
                  <Text>Group Number: {item.groupNum}</Text>
                  <Text>Date: {item.date}</Text>
                  <Text>Study Level: {item.studyLevel}</Text>
                </View>
                <TouchableOpacity
                  style={forms.deleteButton}
                  onPress={() => handleDeleteExam(item.id)}
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
