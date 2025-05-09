import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import Sidebar from "@/components/Sidebar";
import { AddStudent, ManageStudents, AddStudentToGroup } from "@/components/Students";
import { AddCenter, ManageCenters } from "@/components/Centers";

import ManageGroups from "@/components/Groups/ManageGroups";
import NewGroup from "@/components/Groups/NewGroup";

import { ManageExams } from "@/components/Exams";
import AddExam from "@/components/Exams/addExam";
import { AddGrade, ManageGrades } from "@/components/Grades";
import { NewAttendance, AttendanceHistory } from "@/components/Attendance";
import { MyProfile } from "@/components/MyProfile";
import { Statistics } from "@/components/Statistics";


export default function Home() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [expandedOption, setExpandedOption] = useState<string | null>(null);
  const router = useRouter();
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  const handleLogout = async () => {
    router.replace("/(auth)/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Statistics":
        return <Statistics />;
      case "Add Student":
        return <AddStudent />;
      case "Manage Students":
        return <ManageStudents />;
      case "Add Student to Group":
        return <AddStudentToGroup />;
      case "Add Center":
        return <AddCenter />;
      case "Manage Centers":
        return <ManageCenters />;
      case "Add Group":
        return <NewGroup />;
      case "Manage Groups":
        return <ManageGroups />;
      case "Add Grade":
        return <AddGrade />;
      case "Manage Grades":
        return <ManageGrades />;
      case "Attendance":
        return <NewAttendance />;
      case "Attendance History":
        return <AttendanceHistory />;

        case "Manage Exams":
          return <ManageExams />;
        case "Add Exam":
          return <AddExam />;
        case "My Profile":
          return <MyProfile />;
      default:
        return <Statistics />; // Default content can be changed as needed
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        expandedOption={expandedOption}
        setExpandedOption={setExpandedOption}
        handleLogout={handleLogout}
        setSidebarVisible={() => {}}
        setSidebarMinimized={setSidebarMinimized}
      />
      <View style={{
        flex: 1,
        marginLeft: sidebarMinimized ? 60 : 220,
      }}>
        {renderContent()}
      </View>
    </View>
  );
}
