import { useState, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { db } from "@/config/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from '@react-native-picker/picker';

export default function Addgroup() {
  const [name, setName] = useState("");
  const [groupDay, setGroupDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [centers, setCenters] = useState<any[]>([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [studyLevel, setStudyLevel] = useState("");
  const [grades, setGrades] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState("");

  const fetchCenters = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "centers"));
      const centersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
        location: doc.data().location || "",
      }));
      setCenters(centersData);
    } catch (error) {
      console.error("Error fetching centers: ", error);
    }
  };

  const fetchGrades = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "grades"));
      const gradesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
      }));
      setGrades(gradesData);
    } catch (error) {
      console.error("Error fetching grades: ", error);
    }
  };

  useEffect(() => {
    fetchCenters();
    fetchGrades();
  }, []);

  const handleAddgroup = async () => {
    if (!name || !groupDay || !startTime || !endTime || !selectedCenter || !selectedGrade) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in all fields.",
        position: "center",
      });
      return;
    }

    try {
      await addDoc(collection(db, "groups"), {
        name,
        groupDay,
        startTime,
        endTime,
        centerId: selectedCenter,
        gradeId: selectedGrade,
      });
      Swal.fire({
        icon: "success",
        title: "Group Added",
        text: "Group added successfully!",
        position: "center",
      });
      setName("");
      setGroupDay("");
      setStartTime("");
      setEndTime("");
      setSelectedCenter("");
      setSelectedGrade("");
    } catch (error) {
      console.error("Error adding group: ", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add group.",
        position: "center",
      });
    }
  };

  const daysOfWeek = [
    { value: "", label: "Select Day" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Add New Group</Text>

          <View style={styles.inputContainer}>
            <Icon name="user" style={styles.inputIcon} />
            <TextInput
              style={styles.formInput}
              placeholder="Group Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="graduation-cap" style={styles.inputIcon} />
            <Picker
              selectedValue={selectedGrade}
              onValueChange={(itemValue) => setSelectedGrade(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Grade" value="" />
              {grades.map((grade) => (
                <Picker.Item key={grade.id} label={grade.name} value={grade.id} />
              ))}
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Icon name="building" style={styles.inputIcon} />
            <Picker
              selectedValue={selectedCenter}
              onValueChange={(itemValue) => setSelectedCenter(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Center" value="" />
              {centers.map((center) => (
                <Picker.Item key={center.id} label={center.name} value={center.id} />
              ))}
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Icon name="calendar" style={styles.inputIcon} />
            <Picker
              selectedValue={groupDay}
              onValueChange={(itemValue) => setGroupDay(itemValue)}
              style={styles.picker}
            >
              {daysOfWeek.map((day) => (
                <Picker.Item key={day.value} label={day.label} value={day.value} />
              ))}
            </Picker>
          </View>

          <View style={styles.termContainer}>
            <View>
              <View>
                <Icon name="clock-o" style={styles.inputIcon} />
                <TextInput
                  placeholder="Start Time"
                  value={startTime}
                  onChangeText={setStartTime}
                  placeholderTextColor="#888"
                />
              </View>
            </View>

            <View>
              <View>
                <Icon name="clock-o" style={styles.inputIcon} />
                <TextInput
                  placeholder="End Time"
                  value={endTime}
                  onChangeText={setEndTime}
                  placeholderTextColor="#888"
                />
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.formButton} onPress={handleAddgroup}>
            <Text style={styles.formButtonText}>Add Group</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'left',
    color: '#2c3e50',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 10,
    color: '#3498db',
    fontSize: 18,
  },
  formInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'left',
  },
  picker: {
    flex: 1,
    height: 40,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
  },
  termContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  termTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'left',
    color: '#2c3e50',
  },
  termOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  selectedTerm: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  termText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
  },
  selectedTermText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  formButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  formButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
