import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const BACKEND_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5001"
    : "http://localhost:5001";

type FileItem = {
  name: string;
  uri: string;
};

type UploadResponse = {
  message?: string;
  error?: string;
};

export default function Upload() {
  const [modalVisible, setModalVisible] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [msg, setMsg] = useState("");
  
  const pickAndUploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
  
      if (result.canceled) {
        console.log("User canceled document picker");
        return;
      }
  
      const file = result.assets[0];
      const { name, uri, mimeType } = file;
  
      setFiles((prev) => [...prev, { name, uri }]);
      const formData = new FormData();
      formData.append("file", {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        name,
        type: mimeType || "application/octet-stream",
      } as any);
  
      const res = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
  
      const data = await res.json();
      setMsg(data.message || data.error || "No message returned");

      setTimeout(() => {
        DocumentPicker.getDocumentAsync({ type: "*/*" });
      }, 200);
  
    } catch (err) {
      console.error(err);
      setMsg("Upload failed");
    }
  };
  
  const removeFile = async (index: number) => {
    const fileToRemove = files[index];
    try {
      const res = await fetch(
        `${BACKEND_URL}/upload/${encodeURIComponent(fileToRemove.name)}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      setFiles((prev) => prev.filter((_, i) => i !== index));
      if (res.ok) {
        setMsg("✅ Successfully deleted");
      } else {
        setMsg(data.error || "❌ Failed to delete file");
      }
      setTimeout(() => setMsg(""), 2500);
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to delete file");
      setTimeout(() => setMsg(""), 2500);
    }
  };
  
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

      {msg ? <Text style={{ marginTop: 10 }}>{msg}</Text> : null}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="cloud-upload-outline" size={22} color="#4338CA" />
          <Text style={[styles.navText, styles.navActive]}>Upload</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="document-text-outline" size={22} color="#000" />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings-outline" size={22} color="#000" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>

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
        <View key={index} style={styles.fileCard}>
          <Ionicons name="document-text-outline" size={32} color="#4B5563" />
            <Text style={styles.fileName}>{file.name}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFile(index)}
              >
          <Ionicons name="trash-outline" size={16} color="#DC2626" />
              </TouchableOpacity>
        </View>
      ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.managePermissions}
              onPress={pickAndUploadFile}
            >
              <Text style={styles.manageText}>Select and Upload a file</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.backButtonText}>Back</Text>
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
  title: { fontSize: 24, fontWeight: "600", color: "#1F2937", marginBottom: 40 },
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
  uploadText: { marginTop: 12, fontSize: 16, color: "#6B7280" },
  orText: { fontSize: 16, color: "#6B7280", marginVertical: 20 },
  takePictureButton: {
    backgroundColor: "#4338CA",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  takePictureText: { color: "#FFF", fontSize: 16, fontWeight: "500" },
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
  navItem: { alignItems: "center" },
  navText: { marginTop: 4, fontSize: 12, color: "#6B7280" },
  navActive: { color: "#4338CA" },
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
  modalTitle: { fontSize: 18, fontWeight: "600", color: "#1F2937", marginBottom: 16 },
  fileList: { flexDirection: "row" },
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
  fileName: { fontSize: 11, color: "#374151", textAlign: "center", marginTop: 6 },
  managePermissions: { marginTop: 12 },
  manageText: { fontSize: 13, color: "#6B7280", textAlign: "right" },
    backButton: {
      marginTop: 16,
      backgroundColor: "#E5E7EB",
      paddingVertical: 10,
      borderRadius: 6,
      alignItems: "center",
    },
    backButtonText: {
      color: "#1F2937",
      fontSize: 14,
      fontWeight: "500",
    },
    removeButton: {
      position: "absolute",
      top: 6,
      right: 6,
      backgroundColor: "#FEE2E2",
      borderRadius: 50,
      padding: 4,
    },    
});


