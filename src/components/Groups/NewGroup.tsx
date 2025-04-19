import { useState, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Picker } from "react-native";
import { db } from "@/config/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { FaUser, FaCalendarAlt, FaClock, FaBuilding } from "react-icons/fa";

export default function Addgroup() {
  const [name, setName] = useState("");
  const [classRoom, setClassRoom] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [centers, setCenters] = useState<any[]>([]);  
  const [selectedCenter, setSelectedCenter] = useState(""); 

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

  useEffect(() => {
    fetchCenters();  
  }, []);

  const handleAddgroup = async () => {
    if (!name || !classRoom || !startTime || !endTime || !selectedTerm || !selectedCenter) {
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
        classRoom,
        startTime,
        endTime,
        term: selectedTerm,
        centerId: selectedCenter,  
      });
      Swal.fire({
        icon: "success",
        title: "Group Added",
        text: "Group added successfully!",
        position: "center",
      });
      setName("");
      setClassRoom("");
      setStartTime("");
      setEndTime("");
      setSelectedTerm("");
      setSelectedCenter("");  
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

  const termOptions = [
    { id: 'first_prep', label: 'First Preparatory' },
    { id: 'second_prep', label: 'Second Preparatory' },
    { id: 'third_prep', label: 'Third Preparatory' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Add New Group</Text>

          <View style={styles.inputContainer}>
            <FaUser style={styles.inputIcon} />
            <TextInput
              style={styles.formInput}
              placeholder="Group Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.termContainer}>
            <Text style={styles.termTitle}>Select Term:</Text>
            {termOptions.map((term) => (
              <TouchableOpacity
                key={term.id}
                style={[
                  styles.termOption,
                  selectedTerm === term.id && styles.selectedTerm
                ]}
                onPress={() => setSelectedTerm(term.id)}
              >
                <Text
                  style={[
                    styles.termText,
                    selectedTerm === term.id && styles.selectedTermText
                  ]}
                >
                  {selectedTerm === term.id ? '✓ ' : ''}{term.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Add center selection dropdown */}
          <View style={styles.inputContainer}>
            <FaBuilding style={styles.inputIcon} />
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
            <FaBuilding style={styles.inputIcon} />
            <TextInput
              style={styles.formInput}
              placeholder="Group Day"
              value={classRoom}
              onChangeText={setClassRoom}
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.termContainer}>
            <View >
              <View>
                <FaClock style={styles.inputIcon} />
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
                <FaClock style={styles.inputIcon} />
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
