import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import Sidebar from "@/components/Sidebar";
import { AddStudent, ManageStudents } from "@/components/Students";
import styles from "@/styles/homeStyles";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [expandedOption, setExpandedOption] = useState<string | null>(null); // Track expanded options
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Add Student":
        return <AddStudent />;
      case "Manage Students":
        return <ManageStudents />;
      default:
        return <AddStudent />; // Default content can be changed as needed
    }
  };

  return (
    <View style={styles.container}>
      <Sidebar
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      expandedOption={expandedOption}
      setExpandedOption={setExpandedOption}
      handleLogout={handleLogout}
      />
      <View style={styles.main_wrapper}>
      {renderContent()}
      </View>
    </View>
  );
}
