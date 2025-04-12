import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { logout } from "@/firebase/authService";
import { useRouter } from "expo-router";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <Text style={styles.contentText}>This is the Dashboard</Text>;
      case "Settings":
        return <Text style={styles.contentText}>This is the Settings page</Text>;
      case "Profile":
        return <Text style={styles.contentText}>This is your Profile</Text>;
      default:
        return <Text style={styles.contentText}>Select a tab</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.sidebar, isSidebarMinimized && styles.sidebarMinimized]}>
        <TouchableOpacity
          style={styles.minimizeButton}
          onPress={() => setIsSidebarMinimized(!isSidebarMinimized)}
        >
          <Text style={styles.minimizeButtonText}>{isSidebarMinimized ? ">" : "<"}</Text>
        </TouchableOpacity>
        {!isSidebarMinimized && (
          <>
            <TouchableOpacity
              style={[styles.tab, activeTab === "Dashboard" && styles.activeTab]}
              onPress={() => setActiveTab("Dashboard")}
            >
              <Text style={styles.tabText}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "Settings" && styles.activeTab]}
              onPress={() => setActiveTab("Settings")}
            >
              <Text style={styles.tabText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "Profile" && styles.activeTab]}
              onPress={() => setActiveTab("Profile")}
            >
              <Text style={styles.tabText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: "25%",
    backgroundColor: "#2c3e50",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  sidebarMinimized: {
    width: "10%",
    alignItems: "center",
  },
  minimizeButton: {
    padding: 10,
    backgroundColor: "#34495e",
    borderRadius: 5,
    marginBottom: 20,
  },
  minimizeButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  tab: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#34495e",
  },
  activeTab: {
    backgroundColor: "#1abc9c",
  },
  tabText: {
    color: "#fff",
    fontSize: 16,
  },
  logoutButton: {
    marginTop: "auto",
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#e74c3c",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ecf0f1",
  },
  contentText: {
    fontSize: 18,
    color: "#2c3e50",
  },
});
