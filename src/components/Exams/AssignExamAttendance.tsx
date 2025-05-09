import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "@/config/firebase";
import { collection, getDoc, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import forms from "@/styles/forms";
import Swal from "sweetalert2";

export default function AssignExamAttendance() {
  const { examId } = useLocalSearchParams<{ examId: string }>();
  const router = useRouter();
  const [exam, setExam] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [scores, setScores] = useState<{ [studentId: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<{ [studentId: string]: number }>({});
  const [atRisk, setAtRisk] = useState<{ [studentId: string]: boolean }>({});

  useEffect(() => {
    const fetchExamAndStudents = async () => {
      setLoading(true);
      // Fetch exam
      const examDoc = await getDoc(doc(db, "exams", examId));
      if (!examDoc.exists()) {
        setExam(null);
        setLoading(false);
        return;
      }
      const examData = examDoc.data();
      setExam({ id: examDoc.id, ...examData });

      // Fetch attendance for the group on the exam date
      const attendanceSnap = await getDocs(
        query(
          collection(db, "attendance"),
          where("groupId", "==", examData.groupId),
          where("date", "==", examData.date)
        )
      );
      const attendedStudentIds = attendanceSnap.docs.map((d) => d.data().studentId);

      // Fetch student details
      const studentsSnap = await getDocs(collection(db, "students"));
      const attendedStudents = studentsSnap.docs
        .filter((doc) => attendedStudentIds.includes(doc.id))
        .map((doc) => ({
          id: doc.id,
          name: doc.data().name || "",
          studentPhone: doc.data().studentPhone || "",
          parentPhone: doc.data().parentPhone || "",
        }));

      setStudents(attendedStudents);

      // --- AI: Exam Performance Prediction ---
      // 1. For each student, get attendance rate and previous exam scores
      const allExamsSnap = await getDocs(collection(db, "exams"));
      const allExams = allExamsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      // For attendance rate, count all sessions for this group
      const allAttendanceSnap = await getDocs(collection(db, "attendance"));
      const allAttendance = allAttendanceSnap.docs.map(d => d.data());
      // Get all unique dates for this group
      const groupDates = Array.from(new Set(
        allAttendance
          .filter(a => a.groupId === examData.groupId)
          .map(a => a.date)
      ));
      // For each student, compute attendance rate and previous exam scores
      const pred: { [studentId: string]: number } = {};
      const risk: { [studentId: string]: boolean } = {};
      attendedStudents.forEach(student => {
        // Attendance rate
        const attendedCount = allAttendance.filter(
          a => a.groupId === examData.groupId && a.studentId === student.id
        ).length;
        const attendanceRate = groupDates.length > 0 ? attendedCount / groupDates.length : 1;
        // Previous exam scores (exclude this exam)
        const prevScores: number[] = [];
        allExams.forEach((ex: any) => {
          if (
            ex.id !== examDoc.id &&
            ex.groupId === examData.groupId &&
            Array.isArray(ex.students)
          ) {
            const found = ex.students.find((s: any) => s.id === student.id && typeof s.score === "number");
            if (found) prevScores.push(found.score);
          }
        });
        // Weighted average: 60% previous exams, 40% attendance
        let prevAvg = prevScores.length > 0 ? prevScores.reduce((a, b) => a + b, 0) / prevScores.length : 0;
        // If exam has a score field, scale attendance to exam score
        const maxScore = examData.score || 100;
        const attendanceScore = attendanceRate * maxScore;
        const predicted = prevScores.length > 0
          ? (0.6 * prevAvg + 0.4 * attendanceScore)
          : attendanceScore; // If no prev, just attendance
        pred[student.id] = Math.round(predicted * 100) / 100;
        risk[student.id] = predicted < (maxScore * 0.5);
      });
      setPredictions(pred);
      setAtRisk(risk);

      // Load existing scores if present
      if (examData.students && Array.isArray(examData.students)) {
        const scoreMap: { [studentId: string]: string } = {};
        examData.students.forEach((s: any) => {
          if (s && s.id) scoreMap[s.id] = s.score?.toString() ?? "";
        });
        setScores(scoreMap);
      } else {
        setScores({});
      }
      setLoading(false);
    };
    if (examId) fetchExamAndStudents();
  }, [examId]);

  const handleSave = async () => {
    if (!exam) return;
    // Prepare students array with scores
    const studentsWithScores = students.map((s) => ({
      id: s.id,
      score: scores[s.id] ? Number(scores[s.id]) : 0,
    }));
    try {
      await updateDoc(doc(db, "exams", exam.id), {
        students: studentsWithScores,
      });
      Swal.fire({
        icon: "success",
        title: "Saved",
        text: "Exam attendance and scores saved!",
        position: "center",
      });
      router.replace("/(tabs)/Home");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save scores.",
        position: "center",
      });
    }
  };

  // Update a single student's score
  const handleUpdateStudentScore = async (studentId: string) => {
    if (!exam) return;
    const updatedScore = scores[studentId] ? Number(scores[studentId]) : 0;
    // Prepare updated students array
    let studentsWithScores = Array.isArray(exam.students) ? [...exam.students] : [];
    const idx = studentsWithScores.findIndex((s: any) => s.id === studentId);
    if (idx !== -1) {
      studentsWithScores[idx].score = updatedScore;
    } else {
      studentsWithScores.push({ id: studentId, score: updatedScore });
    }
    try {
      await updateDoc(doc(db, "exams", exam.id), {
        students: studentsWithScores,
      });
      setExam((prev: any) => ({ ...prev, students: studentsWithScores }));
      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Student score updated!",
        position: "center",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update score.",
        position: "center",
      });
    }
  };

  if (loading) {
    return (
      <View style={forms.formContainer}>
        <Text style={forms.formTitle}>Assign Exam Attendance</Text>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={forms.formContainer}>
      <Text style={forms.formTitle}>Assign Exam Attendance</Text>
      <Text style={{ marginBottom: 10 }}>
        Exam: {exam?.name} | Date: {exam?.date} | Score: {exam?.score}
      </Text>
      {students.length === 0 ? (
        <Text style={forms.noDataText}>No students attended this exam.</Text>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={forms.listItem}>
              <View>
                <Text style={forms.listItemTitle}>{item.name}</Text>
                <Text>Student Phone: {item.studentPhone}</Text>
                <Text>Parent Phone: {item.parentPhone}</Text>
                <Text>
                  Predicted Score:{" "}
                  <Text style={{
                    color: atRisk[item.id] ? "#e74c3c" : "#27ae60",
                    fontWeight: atRisk[item.id] ? "bold" : "normal"
                  }}>
                    {predictions[item.id] ?? "-"}
                  </Text>
                  {exam?.score ? ` / ${exam.score}` : ""}
                  {atRisk[item.id] ? " (At Risk)" : ""}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                  style={[forms.textInput, { width: 60 }]}
                  placeholder="Score"
                  value={scores[item.id] ?? ""}
                  keyboardType="numeric"
                  onChangeText={(val) =>
                    setScores((prev) => ({ ...prev, [item.id]: val }))
                  }
                />
                <Text style={{ marginLeft: 6 }}>/ {exam?.score}</Text>
                <TouchableOpacity
                  style={[forms.formButton, { marginLeft: 8 }]}
                  onPress={() => handleUpdateStudentScore(item.id)}
                >
                  <Text style={forms.formButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      <TouchableOpacity style={forms.formButton} onPress={handleSave}>
        <Text style={forms.formButtonText}>Save Scores</Text>
      </TouchableOpacity>
    </View>
  );
}
