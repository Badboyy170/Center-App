import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import forms from "@/styles/forms";

export default function HomePage() {
  const router = useRouter();
  const windowWidth = Dimensions.get("window").width;
  const isSmallScreen = windowWidth < 700;

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
      <View style={[
        forms.formContainer,
        styles.hero,
        isSmallScreen && { margin: 10, padding: 18 }
      ]}>
        <Text style={styles.title}>Welcome to <Text style={{ color: "#ffd700" }}>CenterApp</Text></Text>
        <Text style={styles.subtitle}>
          The all-in-one management solution for educational centers and teachers.
        </Text>
        <View style={styles.heroFeatures}>
          <FeatureCard icon="👩‍🎓" label="Student Management" />
          <FeatureCard icon="👨‍🏫" label="Group & Grade Management" />
          <FeatureCard icon="📝" label="Exam & Attendance" />
          <FeatureCard icon="📊" label="AI Insights" />
        </View>
      </View>
      <View style={[
        forms.formContainer,
        styles.section,
        isSmallScreen && { margin: 10, padding: 14 }
      ]}>
        <Text style={styles.sectionTitle}>Why CenterApp?</Text>
        <Text style={styles.sectionText}>
          CenterApp empowers teachers and administrators to efficiently manage students, groups, grades, exams, and attendance in one modern, mobile-friendly platform.{"\n"}
          Our features are designed to save you time, provide actionable insights, and help every student succeed.
        </Text>
      </View>
      <View style={[
        forms.formContainer,
        styles.section,
        isSmallScreen && { margin: 10, padding: 14 }
      ]}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        <FeatureBlock
          icon="👩‍🎓"
          title="Student Management"
          text="Add, edit, search, and bulk-manage students. Assign students to groups, view their QR codes, and track their progress."
        />
        <FeatureBlock
          icon="👨‍🏫"
          title="Group & Grade Management"
          text="Organize students into groups and grades for easier tracking and reporting. Quickly add or edit groups and grades as your center grows."
        />
        <FeatureBlock
          icon="📝"
          title="Exam & Attendance Tracking"
          text="Create exams, assign scores, and track attendance with just a few taps. Use bulk actions to manage multiple students at once."
        />
        <FeatureBlock
          icon="📊"
          title="Modern Statistics & AI Insights"
          text="Visualize your center's performance with beautiful, responsive statistics cards. Instantly see total students, groups, attendance averages, and exam score trends by grade. AI-powered features help you identify at-risk students and predict exam performance, so you can intervene early and help every learner thrive."
        />
        <FeatureBlock
          icon="🛡️"
          title="Secure & Mobile-Ready"
          text="All your data is securely stored in the cloud. CenterApp works beautifully on any device, so you can manage your center from anywhere."
        />
      </View>
      <View style={[
        forms.formContainer,
        styles.section,
        isSmallScreen && { margin: 10, padding: 14 }
      ]}>
        <Text style={styles.sectionTitle}>How CenterApp Helps Teachers</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Save hours every week with bulk actions and smart search.</Text>
          <Text style={styles.bulletItem}>• Instantly spot students who need help with AI-powered risk detection.</Text>
          <Text style={styles.bulletItem}>• Track attendance and exam results in real time.</Text>
          <Text style={styles.bulletItem}>• Communicate with parents and students easily.</Text>
          <Text style={styles.bulletItem}>• Make data-driven decisions to improve outcomes for every learner.</Text>
        </View>
      </View>
      <View style={[
        forms.formContainer,
        styles.section,
        { marginBottom: 40 },
        isSmallScreen && { margin: 10, padding: 14 }
      ]}>
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

// Modern feature card for hero section
function FeatureCard({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={featureCardStyles.card}>
      <Text style={featureCardStyles.icon}>{icon}</Text>
      <Text style={featureCardStyles.label}>{label}</Text>
    </View>
  );
}

// Modern feature block for details
function FeatureBlock({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <View style={featureBlockStyles.block}>
      <Text style={featureBlockStyles.icon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={featureBlockStyles.title}>{title}</Text>
        <Text style={featureBlockStyles.text}>{text}</Text>
      </View>
    </View>
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
    letterSpacing: 0.5,
  },
  subtitle: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 18,
    opacity: 0.95,
  },
  heroFeatures: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
    gap: 8,
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
    letterSpacing: 0.2,
  },
  sectionText: {
    color: "#e0e6ed",
    fontSize: 15,
    marginBottom: 8,
    lineHeight: 22,
  },
  bulletList: {
    marginTop: 6,
    marginBottom: 6,
    paddingLeft: 8,
  },
  bulletItem: {
    color: "#e0e6ed",
    fontSize: 15,
    marginBottom: 4,
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

const featureCardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#3e5a7a",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    marginHorizontal: 6,
    marginVertical: 4,
    minWidth: 90,
    minHeight: 70,
    flexDirection: "column",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 1,
  },
  icon: {
    fontSize: 28,
    marginBottom: 2,
  },
  label: {
    color: "#ffd700",
    fontWeight: "bold",
    fontSize: 13,
    textAlign: "center",
  },
});

const featureBlockStyles = StyleSheet.create({
  block: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 8,
  },
  icon: {
    fontSize: 22,
    marginRight: 10,
    marginTop: 2,
  },
  title: {
    color: "#ffd700",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
  },
  text: {
    color: "#e0e6ed",
    fontSize: 15,
    lineHeight: 22,
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
