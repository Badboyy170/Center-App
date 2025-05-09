import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import forms from "@/styles/forms";

export default function HomePage() {
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#334c66" }}>
      {/* Header */}
      <View style={headerFooterStyles.header}>
        <Text style={headerFooterStyles.headerTitle}>CenterApp</Text>
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 18,
            top: 14,
            backgroundColor: "#007bff",
            borderRadius: 8,
            paddingVertical: 6,
            paddingHorizontal: 16,
          }}
          onPress={() => {
            router.push("/(auth)/login");
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={[forms.formContainer, styles.hero]}>
        <Text style={styles.title}>Welcome to CenterApp</Text>
        <Text style={styles.subtitle}>
          The all-in-one management solution for educational centers and teachers.
        </Text>
      </View>
      <View style={[forms.formContainer, styles.section]}>
        <Text style={styles.sectionTitle}>Why CenterApp?</Text>
        <Text style={styles.sectionText}>
          CenterApp empowers teachers and administrators to efficiently manage students, groups, grades, exams, and attendance in one modern, mobile-friendly platform. 
          Our features are designed to save you time, provide actionable insights, and help every student succeed.
        </Text>
      </View>
      <View style={[forms.formContainer, styles.section]}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        <Text style={styles.featureTitle}>👩‍🎓 Student Management</Text>
        <Text style={styles.sectionText}>
          Add, edit, search, and bulk-manage students. Assign students to groups, view their QR codes, and track their progress.
        </Text>
        <Text style={styles.featureTitle}>👨‍🏫 Group & Grade Management</Text>
        <Text style={styles.sectionText}>
          Organize students into groups and grades for easier tracking and reporting. Quickly add or edit groups and grades as your center grows.
        </Text>
        <Text style={styles.featureTitle}>📝 Exam & Attendance Tracking</Text>
        <Text style={styles.sectionText}>
          Create exams, assign scores, and track attendance with just a few taps. Use bulk actions to manage multiple students at once.
        </Text>
        <Text style={styles.featureTitle}>📊 Modern Statistics & AI Insights</Text>
        <Text style={styles.sectionText}>
          Visualize your center's performance with beautiful, responsive statistics cards. Instantly see total students, groups, attendance averages, and exam score trends by grade. 
          AI-powered features help you identify at-risk students and predict exam performance, so you can intervene early and help every learner thrive.
        </Text>
        <Text style={styles.featureTitle}>🛡️ Secure & Mobile-Ready</Text>
        <Text style={styles.sectionText}>
          All your data is securely stored in the cloud. CenterApp works beautifully on any device, so you can manage your center from anywhere.
        </Text>
      </View>
      <View style={[forms.formContainer, styles.section]}>
        <Text style={styles.sectionTitle}>How CenterApp Helps Teachers</Text>
        <Text style={styles.sectionText}>
          - Save hours every week with bulk actions and smart search.
          {"\n"}- Instantly spot students who need help with AI-powered risk detection.
          {"\n"}- Track attendance and exam results in real time.
          {"\n"}- Communicate with parents and students easily.
          {"\n"}- Make data-driven decisions to improve outcomes for every learner.
        </Text>
      </View>
      <View style={[forms.formContainer, styles.section, { marginBottom: 40 }]}>
        <Text style={styles.sectionTitle}>Get Started</Text>
        <Text style={styles.sectionText}>
          Use the sidebar to navigate through the app and explore all the features. CenterApp is here to make your teaching and management experience easier, smarter, and more effective.
        </Text>
      </View>
      {/* Footer */}
      <View style={headerFooterStyles.footer}>
        <Text style={headerFooterStyles.footerText}>
          © {new Date().getFullYear()} CenterApp. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: "#334c66",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
    paddingVertical: 30,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  section: {
    backgroundColor: "#3e5a7a",
    marginVertical: 10,
    borderRadius: 12,
    padding: 18,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionText: {
    color: "#e0e6ed",
    fontSize: 15,
    marginBottom: 8,
    lineHeight: 22,
  },
  featureTitle: {
    color: "#ffd700",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 2,
  },
});

const headerFooterStyles = StyleSheet.create({
  header: {
    backgroundColor: "#22334d",
    paddingVertical: 18,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#2d3e5e",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  footer: {
    backgroundColor: "#22334d",
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#2d3e5e",
  },
  footerText: {
    color: "#b0b7c3",
    fontSize: 13,
    textAlign: "center",
  },
});
