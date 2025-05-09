import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, Image } from "react-native";
import { getAuth, updateProfile } from "firebase/auth";
import { getApp } from "firebase/app";
import * as ImagePicker from "expo-image-picker";
import forms from "@/styles/forms";
import AwesomeAlert from "react-native-awesome-alerts";

// Cloudinary REST API endpoint for image upload
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dxpkjuudf/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

export default function MyProfile() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Alert state
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

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setName(user.displayName || "");
    setEmail(user.email || "");
    setPhotoURL(user.photoURL || null);
    setLoading(false);
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    try {
      await updateProfile(user, {
        displayName: name,
        photoURL: photoURL || undefined,
      });
      const auth = getAuth(getApp());
      await auth.currentUser?.reload();
      showAlert("Profile Updated", "Your profile has been updated.", true);
    } catch (error) {
      showAlert("Error", "Failed to update profile.", false);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      try {
        // Send POST request to Cloudinary REST API
        const formData = new FormData();
        formData.append("file", `data:image/jpeg;base64,${asset.base64}`);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.secure_url) {
          setPhotoURL(data.secure_url);
        } else {
          showAlert("Error", "Failed to upload image to Cloudinary.", false);
        }
      } catch (err) {
        showAlert("Error", "Image upload failed.", false);
      }
    }
  };

  if (loading) {
    return (
      <View style={forms.formContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={forms.formContainer}>
      <Text style={forms.formTitle}>My Profile</Text>
      <TouchableOpacity onPress={handlePickImage} style={{ alignSelf: "center", marginBottom: 16 }}>
        {photoURL ? (
          <Image
            source={{ uri: photoURL }}
            style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 8 }}
          />
        ) : (
          <View style={{
            width: 100, height: 100, borderRadius: 50, backgroundColor: "#eee",
            justifyContent: "center", alignItems: "center", marginBottom: 8
          }}>
            <Text style={{ color: "#888" }}>Pick Photo</Text>
          </View>
        )}
        <Text style={{ color: "#007bff", textAlign: "center" }}>Change Profile Picture</Text>
      </TouchableOpacity>
      <View style={forms.inputContainer}>
        <TextInput
          style={forms.formInput}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={forms.inputContainer}>
        <TextInput
          style={forms.formInput}
          placeholder="Email"
          value={email}
          editable={false}
        />
      </View>
      <TouchableOpacity style={forms.formButton} onPress={handleSave}>
        <Text style={forms.formButtonText}>Save</Text>
      </TouchableOpacity>
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
        onConfirmPressed={() => setAlertVisible(false)}
        onDismiss={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
}
