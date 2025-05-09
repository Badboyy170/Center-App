import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import forms from "@/styles/forms";

const cardColors = [
  "#007bff", "#27ae60", "#f39c12", "#e74c3c", "#8e44ad", "#16a085", "#2d3436"
];

function StatCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  return (
    <View style={{
      backgroundColor: color,
      borderRadius: 12,
      padding: 18,
      margin: 8,
      minWidth: 140,
      flex: 1,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    }}>
      <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold", marginBottom: 6, textAlign: "center" }}>{title}</Text>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold", textAlign: "center" }}>{value}</Text>
    </View>
  );
}

export default function Statistics() {
  const [loading, setLoading] = useState(true);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0);
  const [grades, setGrades] = useState<{ id: string; name: string }[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<{ [gradeId: string]: number }>({});
  const [examStats, setExamStats] = useState<{ [gradeId: string]: number }>({});

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      // Fetch students, groups, grades
      const studentsSnap = await getDocs(collection(db, "students"));
      const students = studentsSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })) as any[];
      setTotalStudents(students.length);

      const groupsSnap = await getDocs(collection(db, "groups"));
      setTotalGroups(groupsSnap.size);

      const gradesSnap = await getDocs(collection(db, "grades"));
      const gradesArr = gradesSnap.docs.map(doc => ({ id: doc.id, name: doc.data().name || "" }));
      setGrades(gradesArr);

      // Attendance average per grade
      const attendanceSnap = await getDocs(collection(db, "attendance"));
      const attendance = attendanceSnap.docs.map(doc => doc.data());
      // Map studentId to gradeId
      const studentGradeMap: { [studentId: string]: string } = {};
      students.forEach(s => { if (s.id && s.grade) studentGradeMap[s.id] = s.grade; });

      // Count attendance per grade
      const attendanceCount: { [gradeId: string]: { attended: number; total: number } } = {};
      gradesArr.forEach(g => attendanceCount[g.id] = { attended: 0, total: 0 });

      attendance.forEach(a => {
        const gradeId = studentGradeMap[a.studentId];
        if (gradeId) {
          attendanceCount[gradeId].attended += 1;
        }
      });

      // For total, count all attendance sessions * students in grade
      gradesArr.forEach(g => {
        const studentsInGrade = students.filter(s => s.grade === g.id);
        // Find all unique dates in attendance
        const uniqueDates = Array.from(new Set(attendance.map(a => a.date)));
        attendanceCount[g.id].total = studentsInGrade.length * uniqueDates.length;
      });

      const attendancePercentages: { [gradeId: string]: number } = {};
      gradesArr.forEach(g => {
        const stat = attendanceCount[g.id];
        attendancePercentages[g.id] = stat.total > 0 ? Math.round((stat.attended / stat.total) * 100) : 0;
      });
      setAttendanceStats(attendancePercentages);

      // Exam scores average per grade
      const examsSnap = await getDocs(collection(db, "exams"));
      const exams = examsSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })) as any[];
      const examScores: { [gradeId: string]: number[] } = {};
      gradesArr.forEach(g => examScores[g.id] = []);
      exams.forEach(exam => {
        if (exam.gradeId && Array.isArray(exam.students)) {
          exam.students.forEach((s: any) => {
            if (typeof s.score === "number") {
              examScores[exam.gradeId].push(s.score);
            }
          });
        }
      });
      const examAverages: { [gradeId: string]: number } = {};
      gradesArr.forEach(g => {
        const scores = examScores[g.id];
        examAverages[g.id] = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      });
      setExamStats(examAverages);

      setLoading(false);
    };
    fetchStats();
  }, []);

  const windowWidth = Dimensions.get("window").width;
  const isSmallScreen = windowWidth < 600;

  if (loading) {
    return (
      <View style={forms.formContainer}>
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>Loading statistics...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        horizontal={false}
      >
        <View
          style={[
            forms.formContainer,
            {
              minHeight: 0,
              maxHeight: undefined,
              margin: isSmallScreen ? 5 : 20,
              padding: isSmallScreen ? 10 : 20,
              overflow: "scroll", // Add overflow for horizontal scroll if needed
            }
          ]}
        >
          <Text style={forms.formTitle}>Statistics</Text>
          <ScrollView
            horizontal={!isSmallScreen}
            showsHorizontalScrollIndicator={!isSmallScreen}
            contentContainerStyle={{
              flexDirection: isSmallScreen ? "column" : "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "stretch",
              minWidth: !isSmallScreen ? 600 : undefined,
            }}
            style={{ width: "100%" }}
          >
            <StatCard title="Total Students" value={totalStudents} color={cardColors[0]} />
            <StatCard title="Total Groups" value={totalGroups} color={cardColors[1]} />
          </ScrollView>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18, marginTop: 18, marginBottom: 8 }}>Attendance Average (%) by Grade</Text>
          <ScrollView
            horizontal={!isSmallScreen}
            showsHorizontalScrollIndicator={!isSmallScreen}
            contentContainerStyle={{
              flexDirection: isSmallScreen ? "column" : "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "stretch",
              minWidth: !isSmallScreen ? 600 : undefined,
            }}
            style={{ width: "100%" }}
          >
            {grades.map((g, idx) => (
              <StatCard
                key={g.id}
                title={g.name}
                value={attendanceStats[g.id] !== undefined ? attendanceStats[g.id] + "%" : "-"}
                color={cardColors[(idx + 2) % cardColors.length]}
              />
            ))}
          </ScrollView>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18, marginTop: 18, marginBottom: 8 }}>Exam Scores Average by Grade</Text>
          <ScrollView
            horizontal={!isSmallScreen}
            showsHorizontalScrollIndicator={!isSmallScreen}
            contentContainerStyle={{
              flexDirection: isSmallScreen ? "column" : "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "stretch",
              minWidth: !isSmallScreen ? 600 : undefined,
            }}
            style={{ width: "100%" }}
          >
            {grades.map((g, idx) => (
              <StatCard
                key={g.id}
                title={g.name}
                value={examStats[g.id] !== undefined ? examStats[g.id] : "-"}
                color={cardColors[(idx + 4) % cardColors.length]}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
