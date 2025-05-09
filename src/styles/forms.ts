import { FaBold } from "react-icons/fa";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgb(51, 76, 102)",
    maxHeight: 500,
    minHeight: 450,
    borderRadius: 8,
    margin: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
  },
  formInput: {
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    width: "100%",
    borderWidth: 0,
    margin: 0,
  },
  formButton: {
    height: 36, // reduced from 50
    backgroundColor: "#007bff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6, // added for smaller button
    paddingHorizontal: 12, // added for smaller button
  },
  formButtonText: {
    color: "#fff",
    fontSize: 14, // reduced from 16
    fontWeight: "bold",
    textAlign: "center",
  },
  formLink: {
    marginTop: 15,
    color: "#007bff",
    fontSize: 14,
    textDecorationLine: "underline",
    textAlign: "center",
  },
  noDataText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    padding: 8, // reduced from 10
    borderRadius: 8,
    minHeight: 32, // ensure touchable area
    minWidth: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 13, // smaller
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  inputIcon: {
    fontSize: 20,
    color: "#888",
    marginRight: 10,
  },

  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    width:'100%'
  },
  fieldContainer:{
    marginBottom :15 ,
    padding :10 ,
  },

  fieldTitle:{
    fontSize :16 ,
    fontWeight : 900 ,
    color :"#333" ,
    marginBottom :5
  },
// Add missing styles for ManageGrades
  textInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  editButton: {
    backgroundColor: "#f1c40f",
    padding: 8, // reduced from 10
    borderRadius: 8,
    marginLeft: 8,
    minHeight: 32,
    minWidth: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 13,
  },
  saveButton: {
    backgroundColor: "#27ae60",
    padding: 8, // reduced from 10
    borderRadius: 8,
    marginLeft: 8,
    minHeight: 32,
    minWidth: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 13,
  },
  cancelButton: {
    backgroundColor: "#95a5a6",
    padding: 8, // reduced from 10
    borderRadius: 8,
    marginLeft: 8,
    minHeight: 32,
    minWidth: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 13,
  },
  searchInput: {
    height: 40,
    paddingHorizontal: 16,
    backgroundColor: "#f1f3f6",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#b0b7c3",
    marginBottom: 16,
    fontSize: 15,
    color: "#222",
  },
  submitButton: {
    height: 36,
    backgroundColor: "#28a745",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  }
 
});
