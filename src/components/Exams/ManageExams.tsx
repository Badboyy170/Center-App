import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { db } from "@/config/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import forms from "@/styles/forms";
import { router } from "expo-router";

export default function ManageExams() {
  interface Exam {
    id: string;
    name: string;
    gradeId: string;
    groupId: string;
    date: string;
    score?: number; // Added score field
    students?: any[];
  }

  const [exams, setExams] = useState<Exam[]>([]);
  const [grades, setGrades] = useState<{ id: string; name: string }[]>([]);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);

  // Fetch grades and groups for display
  useEffect(() => {
    const fetchGrades = async () => {
      const querySnapshot = await getDocs(collection(db, "grades"));
      setGrades(querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
      })));
    };
    const fetchGroups = async () => {
      const querySnapshot = await getDocs(collection(db, "groups"));
      setGroups(querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
      })));
    };
    fetchGrades();
    fetchGroups();
  }, []);

  const fetchExams = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "exams"));
      const examsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
        gradeId: doc.data().gradeId || "",
        groupId: doc.data().groupId || "",
        date: doc.data().date || "",
        score: doc.data().score || 0, // Fetch score from Firestore
        students: doc.data().students || [],
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

  // Helper to get grade/group name
  const getGradeName = (id: string) => grades.find(g => g.id === id)?.name || id;
  const getGroupName = (id: string) => groups.find(g => g.id === id)?.name || id;

  // Responsive item width and layout
  const windowWidth = Dimensions.get("window").width;
  const isSmallScreen = windowWidth < 600;
  const itemWidth = isSmallScreen ? windowWidth - 40 : (windowWidth - 80) / 4; // col-12 on phone, col-4 on desktop

  return (
    <View style={forms.formContainer}>
      <Text style={forms.formTitle}>Manage Exams</Text>
      {exams.length === 0 ? (
        <Text style={forms.noDataText}>No exams exist</Text>
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
            {exams.map((item) => (
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
                <View style={{ width: "100%" }}>
                  <Text style={forms.listItemTitle}>
                    <Text>Exam Name: </Text>
                    <Text>{item.name}</Text>
                  </Text>
                  <Text>
                    <Text>Grade: </Text>
                    <Text>{getGradeName(item.gradeId)}</Text>
                  </Text>
                  <Text>
                    <Text>Group: </Text>
                    <Text>{getGroupName(item.groupId)}</Text>
                  </Text>
                  <Text>
                    <Text>Date: </Text>
                    <Text>{item.date}</Text>
                  </Text>
                  <Text>
                    <Text>Score: </Text>
                    <Text>{item.score}</Text>
                  </Text>
                  <Text>
                    <Text>Assigned Students: </Text>
                    <Text>{item.students?.length ?? 0}</Text>
                  </Text>
                </View>
                <View style={{ flexDirection: "column", width: "100%" }}>
                  <TouchableOpacity
                    style={[forms.formButton, { width: "100%", marginTop: 8 }]}
                    onPress={() => router.push({ pathname: "/AssignExamAttendance", params: { examId: item.id } })}
                  >
                    <Text style={forms.formButtonText}>Assign Exam Attendance</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[forms.deleteButton, { width: "100%", marginTop: 8 }]}
                    onPress={() => handleDeleteExam(item.id)}
                  >
                    <Text style={forms.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
