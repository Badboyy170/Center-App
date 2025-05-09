import React from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "@/styles/homeStyles";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  expandedOption: string | null;
  setExpandedOption?: (option: string | null) => void; 
  handleLogout: () => void;
  setSidebarVisible: (visible: boolean) => void; 
  setSidebarMinimized?: (minimized: boolean) => void; 
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  expandedOption,
  setExpandedOption,
  handleLogout,
  setSidebarVisible,
  setSidebarMinimized,
}: SidebarProps) {
  const isMobile = Platform.OS === "android" || Platform.OS === "ios";
  const [minimized, setMinimized] = useState(isMobile);
  const [localExpandedOption, setLocalExpandedOption] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  const expanded = isMobile ? localExpandedOption : (setExpandedOption ? expandedOption : localExpandedOption);
  const setExpanded = isMobile ? setLocalExpandedOption : (setExpandedOption || setLocalExpandedOption);

  useEffect(() => {
    setMinimized(isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (setSidebarMinimized) setSidebarMinimized(minimized);
  }, [minimized, setSidebarMinimized]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || "User");
      } else {
        setUserName("User");
      }
    });

    const poll = setInterval(() => {
      const user = auth.currentUser;
      setUserName(user?.displayName || "User");
    }, 2000);

    // Set initial value
    const user = auth.currentUser;
    setUserName(user?.displayName || "User");

    return () => {
      unsubscribe();
      clearInterval(poll);
    };
  }, []);

  const toggleSubOptions = (option: string) => {
    if (minimized) {
      setMinimized(false);
      setExpanded(option);
    } else {
      setExpanded(expanded === option ? null : option);
    }
  };

  const SIDEBAR_WIDTH = minimized ? 60 : 220;

  return (
    <>
      <View
        style={[
          styles.sidebar,
          fixedSidebarStyles.sidebar,
          { width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH, maxWidth: SIDEBAR_WIDTH },
          minimized && { alignItems: "center" },
        ]}
      >
        <TouchableOpacity
          style={[
            fixedSidebarStyles.minimizeButton,
         
          ]}
          onPress={() => setMinimized((prev) => !prev)}
          activeOpacity={0.7}
        >
          <Icon
            name={minimized ? "arrow-right-bold-circle" : "arrow-left-bold-circle"}
            size={28}
            color="#007bff"
          />
        </TouchableOpacity>

        {!minimized && (
          <View style={styles.userInfo}>
            <Text style={[
              styles.userName,
              isMobile && { fontSize: 14 }
            ]}>{userName}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.tab, minimized && { marginTop: 30 }]}
          onPress={() => setActiveTab("Statistics")}
        >
          <View style={styles.tabWithArrow}>
            <Icon name="chart-bar" size={20} style={styles.icon} />
            {!minimized && (
              <Text style={[
                styles.tabText,
                isMobile && { fontSize: 13 }
              ]}>Statistics</Text>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab
          ]}
          onPress={() => toggleSubOptions("Centers")}
        >
          <View style={styles.tabWithArrow}>
            <Icon name="school" size={20} style={styles.icon} />
            {!minimized && (
          <Text style={[
            styles.tabText,
            isMobile && { fontSize: 13 }
          ]}>Centers</Text>
            )}
            {!minimized && (
          <Icon
            name="chevron-down"
            size={20}
            style={{
              ...styles.arrow,
              ...(expanded === "Centers" ? styles.arrowRotated : {}),
            }}
          />
            )}
          </View>
        </TouchableOpacity>

        {expanded === "Centers" && !minimized && (
          <View style={styles.subOptions}>
            <TouchableOpacity
              style={[
                styles.subTab,
                activeTab === "Manage Centers" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("Manage Centers")}
            >
              <Icon name="clipboard-list" size={20} style={styles.icon} />
              <Text style={[
                styles.subTabText,
                isMobile && { fontSize: 12 }
              ]}>Manage Centers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.subTab,
                activeTab === "Add Center" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("Add Center")}
            >
              <Icon name="clipboard-list" size={20} style={styles.icon} />
              <Text style={[
                styles.subTabText,
                isMobile && { fontSize: 12 }
              ]}>Add Center</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.tab}
          onPress={() => toggleSubOptions("Exams")}
        >
          <View style={styles.tabWithArrow}>
            <Icon name="school-outline" size={20} style={styles.icon} />
            {!minimized && (
              <Text style={[
                styles.tabText,
                isMobile && { fontSize: 13 }
              ]}>Exams</Text>
            )}
            {!minimized && (
              <Icon
                name="chevron-down"
                size={20}
                style={{
                  ...styles.arrow,
                  ...(expanded === "Exams" ? styles.arrowRotated : {}),
                }}
              />
            )}
          </View>
        </TouchableOpacity>
        {expanded === "Exams" && !minimized && (
          <View style={styles.subOptions}>
            <TouchableOpacity
              style={[
                styles.subTab,
                activeTab === "Manage Exams" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("Manage Exams")}
            >
              <Icon name="clipboard-list" size={20} style={styles.icon} />
              <Text style={[
                styles.subTabText,
                isMobile && { fontSize: 12 }
              ]}>Manage Exams</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.subTab,
                activeTab === "Add Exam" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("Add Exam")}
            >
              <Icon name="clipboard-list" size={20} style={styles.icon} />
              <Text style={[
                styles.subTabText,
                isMobile && { fontSize: 12 }
              ]}>Add Exam</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.tab}
          onPress={() => toggleSubOptions("Students")}
        >
          <View style={styles.tabWithArrow}>
            <Icon name="account-group" size={20} style={styles.icon} />
            {!minimized && (
              <Text style={[
                styles.tabText,
                isMobile && { fontSize: 13 }
              ]}>Students</Text>
            )}
            {!minimized && (
              <Icon
                name="chevron-down"
                size={20}
                style={{
                  ...styles.arrow,
                  ...(expanded === "Students" ? styles.arrowRotated : {}),
                }}
              />
            )}
          </View>
        </TouchableOpacity>
        {expanded === "Students" && !minimized && (
          <View style={styles.subOptions}>
            <TouchableOpacity
              style={[
                styles.subTab,
                activeTab === "Manage Students" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("Manage Students")}
            >
              <Icon name="account-edit" size={20} style={styles.icon} />
              <Text style={[
                styles.subTabText,
                isMobile && { fontSize: 12 }
              ]}>Manage Students</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.subTab,
                activeTab === "Add Student" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("Add Student")}
            >
              <Icon name="account-plus" size={20} style={styles.icon} />
              <Text style={[
                styles.subTabText,
                isMobile && { fontSize: 12 }
              ]}>Add Student</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.subTab,
                activeTab === "Add Student to Group" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("Add Student to Group")}
            >
              <Icon name="account-check" size={20} style={styles.icon} />
              <Text style={[
                styles.subTabText,
                isMobile && { fontSize: 12 }
              ]}>Add Student To Group</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.tab}
          onPress={() => toggleSubOptions("Attendance")}
        >
          <View style={styles.tabWithArrow}>
            <Icon name="clipboard-list" size={20} style={styles.icon} />
            {!minimized && (
              <Text style={[
                styles.tabText,
                isMobile && { fontSize: 13 }
              ]}>Attendance</Text>
            )}
            {!minimized && (
              <Icon
                name="chevron-down"
                size={20}
                style={{
                  ...styles.arrow,
                  ...(expanded === "Attendance" ? styles.arrowRotated : {}),
                }}
              />
            )}
          </View>
        </TouchableOpacity>

        {expanded === "Attendance" && !minimized && (
          <View style={styles.subOptions}>
            <TouchableOpacity
              style={[
                styles.subTab,
                activeTab === "Attendance" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("Attendance")}
            >
              <Icon name="clipboard-list" size={20} style={styles.icon} />
              <Text style={[
                styles.subTabText,
                isMobile && { fontSize: 12 }
              ]}>Manage Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.subTab,
                activeTab === "Attendance History" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("Attendance History")}
            >
              <Icon name="clipboard-list" size={20} style={styles.icon} />
              <Text style={[
                styles.subTabText,
                isMobile && { fontSize: 12 }
              ]}>Attendance History</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.tab}
          onPress={() => toggleSubOptions("Group")}
        >
          <View style={styles.tabWithArrow}>
            <Icon name="layers" size={20} style={styles.icon} />
            {!minimized && (
              <Text style={[
                styles.tabText,
                isMobile && { fontSize: 13 }
              ]}>Groups</Text>
            )}
            {!minimized && (
              <Icon
                name="chevron-down"
                size={20}
                style={{
                  ...styles.arrow,
                  ...(expanded === "Group" ? styles.arrowRotated : {}),
                }}
              />
            )}
          </View>
        </TouchableOpacity>

        {expanded === "Group" && !minimized && (
          <View style={styles.subOptions}>
            <TouchableOpacity
              style={[
                styles.subTab,
                activeTab === "Manage Groups" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("Manage Groups")}
            >
              <Icon name="clipboard-list" size={20} style={styles.icon} />
              <Text style={[
                styles.subTabText,
                isMobile && { fontSize: 12 }
              ]}>Manage Groups</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.subTab,
                activeTab === "Add Group" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("Add Group")}
            >
              <Icon name="clipboard-list" size={20} style={styles.icon} />
              <Text style={[
                styles.subTabText,
                isMobile && { fontSize: 12 }
              ]}>Add group</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.tab}
          onPress={() => toggleSubOptions("Grades")}
        >
          <View style={styles.tabWithArrow}>
            <Icon name="school-outline" size={20} style={styles.icon} />
            {!minimized && (
              <Text style={[
                styles.tabText,
                isMobile && { fontSize: 13 }
              ]}>Grades</Text>
            )}
            {!minimized && (
              <Icon
                name="chevron-down"
                size={20}
                style={{
                  ...styles.arrow,
                  ...(expanded === "Grades" ? styles.arrowRotated : {}),
                }}
              />
            )}
          </View>
        </TouchableOpacity>

        {expanded === "Grades" && !minimized && (
          <View style={styles.subOptions}>
            <TouchableOpacity
              style={[
                styles.subTab,
                activeTab === "Manage Grades" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("Manage Grades")}
            >
              <Icon name="clipboard-list" size={20} style={styles.icon} />
              <Text style={[
                styles.subTabText,
                isMobile && { fontSize: 12 }
              ]}>Manage Grades</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.subTab,
                activeTab === "Add Grade" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("Add Grade")}
            >
              <Icon name="clipboard-list" size={20} style={styles.icon} />
              <Text style={[
                styles.subTabText,
                isMobile && { fontSize: 12 }
              ]}>Add Grade</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab("My Profile")}
        >
          <View style={styles.tabWithArrow}>
            <Icon name="account" size={20} style={styles.icon} />
            {!minimized && (
              <Text style={[
                styles.tabText,
                isMobile && { fontSize: 13 }
              ]}>My Profile</Text>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={20} style={styles.icon} />
          {!minimized && (
            <Text style={[
              styles.logoutText,
              isMobile && { fontSize: 13 }
            ]}>Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}

const fixedSidebarStyles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 10,
    backgroundColor: "#334c66",
    height: Dimensions.get("window").height,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  minimizeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 101,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 2,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
});
