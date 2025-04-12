import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    overflow: "visible",
  },
  main_wrapper: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    padding: 20,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 8,
  },
  sidebar: {
    width: "25%",
    backgroundColor: "#2c3e50",
    paddingVertical: 20,
    paddingHorizontal: 10,
    position: "relative",
    overflow: "visible",
  },
  minimizeButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -50 }],
    right: -20,
    padding: 10,
    backgroundColor: "#34495e",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    zIndex: 10,
  },
  minimizeButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#34495e",
  },
  tabWithArrow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  activeTab: {
    backgroundColor: "#1abc9c",
  },
  tabText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  subOptions: {
    paddingLeft: 20,
  },
  subTab: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: "#3b4a5a",
  },
  subTabText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 10,
  },
  arrow: {
    transform: [{ rotate: "0deg" }],
  },
  arrowRotated: {
    transform: [{ rotate: "180deg" }],
  },
  icon: {
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
  userInfo: {
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#bdc3c7",
    paddingBottom: 10,
  },
  profilePictureContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 10,
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  swal_custom_popup: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
});
