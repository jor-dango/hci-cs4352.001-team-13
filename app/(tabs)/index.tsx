import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Tab() {
  const [modalVisible, setModalVisible] = useState(false);

  const files = [
    { name: "Walmart Contract 1-17-25.docx" },
    { name: "Walmart Contract 3-22-24.pdf" },
    { name: "Pacsun Contract 3-22-24.pdf" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analyze a contract</Text>

      {/* Upload box */}
      <TouchableOpacity
        style={styles.uploadBox}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="cloud-upload-outline" size={48} color="#777" />
        <Text style={styles.uploadText}>Upload a contract</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or</Text>

      <TouchableOpacity style={styles.takePictureButton}>
        <Text style={styles.takePictureText}>Take a picture</Text>
      </TouchableOpacity>

      {/* Upload Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Upload a file</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.fileList}
            >
              {files.map((file, index) => (
                <TouchableOpacity key={index} style={styles.fileCard}>
                  <Ionicons
                    name="document-text-outline"
                    size={32}
                    color="#4B5563"
                  />
                  <Text style={styles.fileName}>{file.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.managePermissions}>
              <Text style={styles.manageText}>Manage file permissions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 40,
  },
  uploadBox: {
    width: 280,
    height: 180,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  orText: {
    fontSize: 16,
    color: "#6B7280",
    marginVertical: 20,
  },
  takePictureButton: {
    backgroundColor: "#4338CA",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  takePictureText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 70,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },
  navActive: {
    color: "#4338CA",
  },

  // Modal styles
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 330,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  fileList: {
    flexDirection: "row",
  },
  fileCard: {
    width: 90,
    height: 110,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  fileName: {
    fontSize: 11,
    color: "#374151",
    textAlign: "center",
    marginTop: 6,
  },
  managePermissions: {
    marginTop: 12,
  },
  manageText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "right",
  },
});
