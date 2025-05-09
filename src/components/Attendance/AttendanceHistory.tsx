import React,{ useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Dimensions } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import forms from "@/styles/forms";

export default function AttendanceHistory() {
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [attendance, setAttendance] = useState<any[]>([]);
  const [groupedAttendance, setGroupedAttendance] = useState<{ [date: string]: any[] }>({});
  const [showModal, setShowModal] = useState(false);
  const [modalDate, setModalDate] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [groupStudentIds, setGroupStudentIds] = useState<string[]>([]);
  const [showUnattendedModal, setShowUnattendedModal] = useState(false);
  const [unattendedModalDate, setUnattendedModalDate] = useState("");
  const [unattendedStudentSearch, setUnattendedStudentSearch] = useState("");
  const [unattendedStudentIds, setUnattendedStudentIds] = useState<string[]>([]);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [riskStudentSearch, setRiskStudentSearch] = useState("");
  const [riskStudents, setRiskStudents] = useState<
    { id: string; name: string; studentPhone?: string; parentPhone?: string; attendanceRate: number; groupAvg: number; groupStd: number; riskReason: string }[]
  >([]);

  const windowWidth = Dimensions.get("window").width;
  const isSmallScreen = windowWidth < 600;

  useEffect(() => {
    const fetchGroups = async () => {
      const querySnapshot = await getDocs(collection(db, "groups"));
      setGroups(querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
      })));
    };
    const fetchStudents = async () => {
      const querySnapshot = await getDocs(collection(db, "students"));
      setStudents(querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
        studentPhone: doc.data().studentPhone || "",
        parentPhone: doc.data().parentPhone || "",
      })));
    };
    fetchGroups();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (!selectedGroup) {
      setAttendance([]);
      setGroupedAttendance({});
      setGroupStudentIds([]);
      return;
    }
    const fetchAttendance = async () => {
      const querySnapshot = await getDocs(collection(db, "attendance"));
      const groupAttendance = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((a) => a.groupId === selectedGroup);

      setAttendance(groupAttendance);

      // Group by date
      const grouped: { [date: string]: any[] } = {};
      groupAttendance.forEach((a) => {
        if (!grouped[a.date]) grouped[a.date] = [];
        grouped[a.date].push(a);
      });
      setGroupedAttendance(grouped);
    };
    const fetchGroupStudents = async () => {
      const sgSnap = await getDocs(collection(db, "studentGroups"));
      const ids = sgSnap.docs
        .filter((doc) => doc.data().groupId === selectedGroup)
        .map((doc) => doc.data().studentId);
      setGroupStudentIds(ids);
    };
    fetchAttendance();
    fetchGroupStudents();
  }, [selectedGroup]);

  // Calculate at-risk students when group or attendance changes
  useEffect(() => {
    if (!selectedGroup || groupStudentIds.length === 0 || attendance.length === 0) {
      setRiskStudents([]);
      return;
    }
    // Count attendance per student
    const studentAttendanceCount: Record<string, number> = {};
    groupStudentIds.forEach(id => { studentAttendanceCount[id] = 0; });
    attendance.forEach(a => {
      if (studentAttendanceCount[a.studentId] !== undefined) {
        studentAttendanceCount[a.studentId]++;
      }
    });
    // Total sessions (unique dates)
    const totalSessions = Object.keys(groupedAttendance).length;
    if (totalSessions === 0) {
      setRiskStudents([]);
      return;
    }
    // Calculate attendance rates
    const rates = groupStudentIds.map(id => (studentAttendanceCount[id] || 0) / totalSessions);
    const groupAvg = rates.reduce((a, b) => a + b, 0) / rates.length;
    const groupStd = Math.sqrt(rates.reduce((a, b) => a + Math.pow(b - groupAvg, 2), 0) / rates.length);

    // Advanced risk logic
    const risk = groupStudentIds
      .map(id => {
        const student = students.find(s => s.id === id);
        const attended = studentAttendanceCount[id] || 0;
        const attendanceRate = attended / totalSessions;
        let riskReason = "";
        if (attendanceRate < 0.7) riskReason = "Below 70%";
        else if (attendanceRate < groupAvg - groupStd) riskReason = "Below group average";
        return {
          id,
          name: student?.name || id,
          studentPhone: student?.studentPhone,
          parentPhone: student?.parentPhone,
          attendanceRate,
          groupAvg,
          groupStd,
          riskReason,
        };
      })
      .filter(s => s.riskReason !== "");
    setRiskStudents(risk);
  }, [selectedGroup, groupStudentIds, attendance, students, groupedAttendance]);

  const openModal = (date: string) => {
    setModalDate(date);
    setStudentSearch("");
    setShowModal(true);
  };

  const openUnattendedModal = (date: string, attendedIds: string[]) => {
    setUnattendedModalDate(date);
    setUnattendedStudentSearch("");
    // Compute unattended student IDs for this date
    setUnattendedStudentIds(groupStudentIds.filter(id => !attendedIds.includes(id)));
    setShowUnattendedModal(true);
  };

  return (
    <View style={forms.formContainer}>
      <Text style={forms.formTitle}>Attendance History</Text>
      <View style={forms.inputContainer}>
        <Text style={{ fontWeight: "bold", marginRight: 10 }}>Group:</Text>
        <Picker
          selectedValue={selectedGroup}
          onValueChange={setSelectedGroup}
          style={forms.picker}
        >
          <Picker.Item label="Select Group" value="" />
          {groups.map((g) => (
            <Picker.Item key={g.id} label={g.name} value={g.id} />
          ))}
        </Picker>
      </View>
      <TouchableOpacity
        style={[forms.formButton, { marginBottom: 10, backgroundColor: "#c0392b" }]}
        onPress={() => setShowRiskModal(true)}
        disabled={!selectedGroup}
      >
        <Text style={forms.formButtonText}>Show At-Risk Students</Text>
      </TouchableOpacity>
      <ScrollView style={{ marginTop: 10 }}>
        {Object.keys(groupedAttendance)
          .sort((a, b) => b.localeCompare(a)) // newest first
          .map((date) => {
            const attendedIds = groupedAttendance[date]?.map((a) => a.studentId) || [];
            const unattendedCount = groupStudentIds.filter(
              (id) => !attendedIds.includes(id)
            ).length;
            return (
              <View
                key={date}
                style={{
                  borderBottomWidth: 1,
                  borderColor: "#eee",
                  paddingVertical: 10,
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: isSmallScreen ? "column" : "row",
                    alignItems: isSmallScreen ? "stretch" : "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: isSmallScreen ? 8 : 0 }}>{date}</Text>
                  <View
                    style={{
                      flexDirection: isSmallScreen ? "column" : "row",
                      alignItems: isSmallScreen ? "stretch" : "center",
                      width: isSmallScreen ? "100%" : undefined,
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        forms.formButton,
                        {
                          marginBottom: isSmallScreen ? 8 : 0,
                          width: isSmallScreen ? "100%" : undefined,
                        },
                      ]}
                      onPress={() => openModal(date)}
                    >
                      <Text style={forms.formButtonText}>Show Attended</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        forms.formButton,
                        {
                          marginLeft: isSmallScreen ? 0 : 8,
                          backgroundColor: "#e67e22",
                          width: isSmallScreen ? "100%" : undefined,
                        },
                      ]}
                      onPress={() => openUnattendedModal(date, attendedIds)}
                    >
                      <Text style={forms.formButtonText}>Show Unattended</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={{ color: "#888", marginTop: 4 }}>
                  Attended: {groupedAttendance[date].length}
                </Text>
                <Text style={{ color: "#888", marginTop: 2 }}>
                  Unattended: {unattendedCount}
                </Text>
              </View>
            );
          })}
      </ScrollView>
      {/* Attended Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
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
            <Text style={[forms.formTitle, { color: "#333" }]}>Attendance Details ({modalDate})</Text>
            <TextInput
              style={[forms.formInput, { marginBottom: 10 }]}
              placeholder="Search student..."
              value={studentSearch}
              onChangeText={setStudentSearch}
            />
            <View style={{ maxHeight: 300 }}>
              {groupedAttendance[modalDate] && groupedAttendance[modalDate].length > 0 ? (
                <View>
                  <View style={{ flexDirection: "row", borderBottomWidth: 1, borderColor: "#ccc", paddingBottom: 4, marginBottom: 6 }}>
                    <Text style={{ flex: 1, fontWeight: "bold" }}>#</Text>
                    <Text style={{ flex: 3, fontWeight: "bold" }}>Name</Text>
                    <Text style={{ flex: 3, fontWeight: "bold" }}>Student Phone</Text>
                    <Text style={{ flex: 3, fontWeight: "bold" }}>Parent Phone</Text>
                  </View>
                  {groupedAttendance[modalDate]
                    .filter((a) => {
                      const student = students.find((s) => s.id === a.studentId);
                      return student && student.name.toLowerCase().includes(studentSearch.toLowerCase());
                    })
                    .map((a, idx) => {
                      const student = students.find((s) => s.id === a.studentId);
                      return (
                        <View key={a.id} style={{ flexDirection: "row", paddingVertical: 4, borderBottomWidth: 1, borderColor: "#eee" }}>
                          <Text style={{ flex: 1 }}>{idx + 1}</Text>
                          <Text style={{ flex: 3 }}>{student ? student.name : a.studentId}</Text>
                          <Text style={{ flex: 3 }}>{student ? student.studentPhone : ""}</Text>
                          <Text style={{ flex: 3 }}>{student ? student.parentPhone : ""}</Text>
                        </View>
                      );
                    })}
                </View>
              ) : (
                <Text style={{ color: "#888", textAlign: "center" }}>No attendance records.</Text>
              )}
            </View>
            <TouchableOpacity
              style={[forms.formButton, { marginTop: 16 }]}
              onPress={() => setShowModal(false)}
            >
              <Text style={forms.formButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Unattended Modal */}
      <Modal
        visible={showUnattendedModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowUnattendedModal(false)}
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
            <Text style={[forms.formTitle, { color: "#333" }]}>Unattended Students ({unattendedModalDate})</Text>
            <TextInput
              style={[forms.formInput, { marginBottom: 10 }]}
              placeholder="Search student..."
              value={unattendedStudentSearch}
              onChangeText={setUnattendedStudentSearch}
            />
            <View style={{ maxHeight: 300 }}>
              {unattendedStudentIds.length > 0 ? (
                <View>
                  <View style={{ flexDirection: "row", borderBottomWidth: 1, borderColor: "#ccc", paddingBottom: 4, marginBottom: 6 }}>
                    <Text style={{ flex: 1, fontWeight: "bold" }}>#</Text>
                    <Text style={{ flex: 3, fontWeight: "bold" }}>Name</Text>
                    <Text style={{ flex: 3, fontWeight: "bold" }}>Student Phone</Text>
                    <Text style={{ flex: 3, fontWeight: "bold" }}>Parent Phone</Text>
                  </View>
                  {unattendedStudentIds
                    .map((id) => students.find((s) => s.id === id))
                    .filter(
                      (student) =>
                        student &&
                        student.name
                          .toLowerCase()
                          .includes(unattendedStudentSearch.toLowerCase())
                    )
                    .map((student, idx) => (
                      <View key={student!.id} style={{ flexDirection: "row", paddingVertical: 4, borderBottomWidth: 1, borderColor: "#eee" }}>
                        <Text style={{ flex: 1 }}>{idx + 1}</Text>
                        <Text style={{ flex: 3 }}>{student!.name}</Text>
                        <Text style={{ flex: 3 }}>{student!.studentPhone}</Text>
                        <Text style={{ flex: 3 }}>{student!.parentPhone}</Text>
                      </View>
                    ))}
                </View>
              ) : (
                <Text style={{ color: "#888", textAlign: "center" }}>No unattended students.</Text>
              )}
            </View>
            <TouchableOpacity
              style={[forms.formButton, { marginTop: 16 }]}
              onPress={() => setShowUnattendedModal(false)}
            >
              <Text style={forms.formButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* At-Risk Students Modal */}
      <Modal
        visible={showRiskModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRiskModal(false)}
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
            width: "95%",
            maxHeight: "85%"
          }}>
            <Text style={[forms.formTitle, { color: "#c0392b" }]}>At-Risk Students</Text>
            <Text style={{ color: "#888", marginBottom: 8, fontSize: 13 }}>
              <Text style={{ fontWeight: "bold" }}>AI logic:</Text> Students are flagged if their attendance is below 70% or more than 1 std deviation below group average.
            </Text>
            <TextInput
              style={[forms.formInput, { marginBottom: 10 }]}
              placeholder="Search student..."
              value={riskStudentSearch}
              onChangeText={setRiskStudentSearch}
            />
            <View style={{ maxHeight: 300 }}>
              {riskStudents.length > 0 ? (
                <View>
                  <View style={{ flexDirection: "row", borderBottomWidth: 1, borderColor: "#ccc", paddingBottom: 4, marginBottom: 6 }}>
                    <Text style={{ flex: 1, fontWeight: "bold" }}>#</Text>
                    <Text style={{ flex: 3, fontWeight: "bold" }}>Name</Text>
                    <Text style={{ flex: 3, fontWeight: "bold" }}>Student Phone</Text>
                    <Text style={{ flex: 3, fontWeight: "bold" }}>Parent Phone</Text>
                    <Text style={{ flex: 2, fontWeight: "bold" }}>%</Text>
                    <Text style={{ flex: 3, fontWeight: "bold" }}>Reason</Text>
                  </View>
                  {riskStudents
                    .filter(s =>
                      s.name.toLowerCase().includes(riskStudentSearch.toLowerCase())
                    )
                    .map((student, idx) => (
                      <View key={student.id} style={{ flexDirection: "row", paddingVertical: 4, borderBottomWidth: 1, borderColor: "#eee" }}>
                        <Text style={{ flex: 1 }}>{idx + 1}</Text>
                        <Text style={{ flex: 3 }}>{student.name}</Text>
                        <Text style={{ flex: 3 }}>{student.studentPhone}</Text>
                        <Text style={{ flex: 3 }}>{student.parentPhone}</Text>
                        <Text style={{ flex: 2 }}>{Math.round(student.attendanceRate * 100)}%</Text>
                        <Text style={{ flex: 3 }}>{student.riskReason}</Text>
                      </View>
                    ))}
                </View>
              ) : (
                <Text style={{ color: "#888", textAlign: "center" }}>No at-risk students.</Text>
              )}
            </View>
            <TouchableOpacity
              style={[forms.formButton, { marginTop: 16 }]}
              onPress={() => setShowRiskModal(false)}
            >
              <Text style={forms.formButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
