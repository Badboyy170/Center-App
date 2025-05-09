import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { login } from "src/firebase/authService";
import { useRouter } from "expo-router";
import Swal from "sweetalert2";
import AwesomeAlert from "react-native-awesome-alerts";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // AwesomeAlert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSuccess, setAlertSuccess] = useState(true);

  const showAlert = (title: string, message: string, success: boolean) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertSuccess(success);
    setAlertVisible(true);
  };

  const handleLogin = async () => {
    try {
      await login(email, password);
      if (Platform.OS === "web") {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back!",
        });
        router.replace("/(tabs)/Home");
      } else {
        showAlert("Login Successful", "Welcome back!", true);
      }
    } catch (err) {
      if (Platform.OS === "web") {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: err.message || "An error occurred. Please try again.",
        });
      } else {
        showAlert("Login Failed", err.message || "An error occurred. Please try again.", false);
      }
    }
  };

  const handleAlertConfirm = () => {
    setAlertVisible(false);
    if (alertSuccess) {
      router.replace("/(tabs)/Home");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
      {Platform.OS !== "web" && (
        <AwesomeAlert
          show={alertVisible}
          showProgress={false}
          title={alertTitle}
          message={alertMessage}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={true}
          showConfirmButton={true}
          confirmText="OK"
          confirmButtonColor={alertSuccess ? "#4BB543" : "#d33"}
          onConfirmPressed={handleAlertConfirm}
          onDismiss={handleAlertConfirm}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    marginTop: 15,
    color: "#007BFF",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
