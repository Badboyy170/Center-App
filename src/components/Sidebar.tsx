import { View, Text, TouchableOpacity } from "react-native";
import { FaHome, FaCog, FaUser, FaUsers, FaPlus, FaChevronDown } from "react-icons/fa";
import styles from "@/styles/homeStyles";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  expandedOption: string | null;
  setExpandedOption: (option: string | null) => void;
  handleLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  expandedOption,
  setExpandedOption,
  handleLogout,
}: SidebarProps) {
  const toggleSubOptions = (option: string) => {
    setExpandedOption(expandedOption === option ? null : option);
  };

  return (
    <View style={styles.sidebar}>
      <TouchableOpacity
        style={styles.minimizeButton}
        onPress={() => setExpandedOption(null)}
      >
        <Text style={styles.minimizeButtonText}>{"<"}</Text>
      </TouchableOpacity>
  
      <View style={styles.userInfo}>
        <View style={styles.profilePictureContainer}>
          <img
            src="https://via.placeholder.com/50"
            alt="Profile"
            style={styles.profilePicture}
          />
        </View>
        <Text style={styles.userName}>John Doe</Text>
      </View>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => toggleSubOptions("Centers")}
      >
         
        <View style={styles.tabWithArrow}>
          <FaUsers className="icon" style={styles.icon} />
          <Text style={styles.tabText}>Centers</Text>
          <FaChevronDown
            className="icon"
            style={{
              ...styles.arrow,
              ...(expandedOption === "Centers" ? styles.arrowRotated : {}),
            }}
          />
        </View>
      </TouchableOpacity>
            {expandedOption === "Centers" && (
        <View style={styles.subOptions}>
          <TouchableOpacity
            style={[styles.subTab, activeTab === "Manage Centers" && styles.activeTab]}
            onPress={() => setActiveTab("Manage Centers")}
          >
            <FaUser className="icon" style={styles.icon} />
            <Text style={styles.subTabText}>Manage Centers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.subTab, activeTab === "Add Center" && styles.activeTab]}
            onPress={() => setActiveTab("Add Center")}
          >
            <FaPlus className="icon" style={styles.icon} />
            <Text style={styles.subTabText}>Add Center</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        style={styles.tab}
        onPress={() => toggleSubOptions("Students")}
      >
         
        <View style={styles.tabWithArrow}>
          <FaUsers className="icon" style={styles.icon} />
          <Text style={styles.tabText}>Students</Text>
          <FaChevronDown
            className="icon"
            style={{
              ...styles.arrow,
              ...(expandedOption === "Students" ? styles.arrowRotated : {}),
            }}
          />
        </View>
      </TouchableOpacity>
      {expandedOption === "Students" && (
        <View style={styles.subOptions}>
          <TouchableOpacity
            style={[styles.subTab, activeTab === "Manage Students" && styles.activeTab]}
            onPress={() => setActiveTab("Manage Students")}
          >
            <FaUser className="icon" style={styles.icon} />
            <Text style={styles.subTabText}>Manage Students</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.subTab, activeTab === "Add Student" && styles.activeTab]}
            onPress={() => setActiveTab("Add Student")}
          >
            <FaPlus className="icon" style={styles.icon} />
            <Text style={styles.subTabText}>Add Student</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
