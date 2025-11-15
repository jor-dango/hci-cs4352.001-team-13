import { GlobalStyles } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
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
import { SafeAreaView } from "react-native-safe-area-context";

const BACKEND_URL = "http://localhost:5001";

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
  const router = useRouter();

  const takePhotoAndUpload = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setMsg("❌ Camera permission denied");
        setTimeout(() => setMsg(""), 2500);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      const { uri } = file;

      const fileName = `photo_${Date.now()}.jpg`;

      const formData = new FormData();
      formData.append("file", {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        name: fileName,
        type: "image/jpeg",
      } as any);

      const res = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type") || "";
      let data: any;
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.warn("Server returned non-JSON:", text);
        data = { error: "Server returned non-JSON response" };
      }

      if (res.ok) {
        const savedName = data.savedFileName || name;
        setFiles((prev) => [...prev, { name: savedName, uri }]);
        setMsg(data.message || "Photo uploaded successfully");

        // Navigate to analysis page with filename
        router.push({
          pathname: "/(tabs)/upload/analysis",
          params: { filename: savedName },
        });
      } else {
        setMsg(data.error || "Upload failed");
      }
      setTimeout(() => setMsg(""), 2500);
    } catch (err) {
      console.error(err);
      setMsg("❌ Upload failed");
      setTimeout(() => setMsg(""), 2500);
    }
  }

  const pickAndUploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      const { name, uri, mimeType } = file;

      const formData = new FormData();
      formData.append("file", {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        name,
        type: mimeType || "application/octet-stream",
      } as any);

      // Upload
      const res = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type") || "";
      let data: any;
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.warn("Server returned non-JSON:", text);
        data = { error: "Server returned non-JSON response" };
      }

      if (res.ok) {
        const savedName = data.savedFileName || name;
        setFiles((prev) => [...prev, { name: savedName, uri }]);
        setMsg(data.message || "File uploaded successfully");

        // Hide modal and navigate to analysis page with filename
        setModalVisible(false);
        router.push({
          pathname: "/(tabs)/upload/analysis",
          params: { filename: savedName },
        });
      } else {
        setMsg(data.error || "Upload failed");
      }
      setTimeout(() => setMsg(""), 2500);
    } catch (err) {
      console.error(err);
      setMsg("❌ Upload failed");
      setTimeout(() => setMsg(""), 2500);
    }
  };
  const removeFile = async (index: number) => {
    const fileToRemove = files[index];
    try {
      const res = await fetch(
        `${BACKEND_URL}/upload/${encodeURIComponent(fileToRemove.name)}`,
        { method: "DELETE" },
      );

      const contentType = res.headers.get("content-type") || "";
      let data: any;
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.warn("Server returned non-JSON:", text);
        data = { error: "Server returned non-JSON response" };
      }

      if (res.ok) {
        setFiles((prev) => prev.filter((_, i) => i !== index));
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
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={GlobalStyles.h3}>Analyze a contract</Text>

        {/* Upload box */}
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="cloud-upload-outline" size={48} color="#9CA3AF" />
          <Text style={[GlobalStyles.body, { color: "#6B7280" }]}>
            Upload a contract
          </Text>
        </TouchableOpacity>

        <Text
          style={[GlobalStyles.body, { color: "#6B7280", marginVertical: 20 }]}
        >
          or
        </Text>

        <TouchableOpacity
          style={styles.takePictureButton}
          activeOpacity={0.7}
          onPress={takePhotoAndUpload}
        >
          <Text
            style={[GlobalStyles.body, { color: "#FFF", fontWeight: "500" }]}
          >
            Take a picture
          </Text>
        </TouchableOpacity>

        {msg ? (
          <Text
            style={[GlobalStyles.small, { marginTop: 16, color: "#6B7280" }]}
          >
            {msg}
          </Text>
        ) : null}

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
                  <TouchableOpacity
                    key={index}
                    style={styles.fileCard}
                    onPress={() => {
                      setModalVisible(false);
                      router.push({
                        pathname: "/(tabs)/upload/analysis",
                        params: { filename: file.name },
                      });
                    }}
                  >
                    <Ionicons
                      name="document-text-outline"
                      size={32}
                      color="#4B5563"
                    />
                    <Text style={styles.fileName}>{file.name}</Text>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color="#DC2626"
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.managePermissions}
                onPress={pickAndUploadFile}
                activeOpacity={0.7}
              >
                <Text style={styles.manageText}>Upload a file</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#EDEDF0",
  },
  container: {
    flex: 1,
    backgroundColor: "#EDEDF0",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  uploadBox: {
    width: "100%",
    maxWidth: 320,
    height: 180,
    borderWidth: 2,
    borderColor: "#BEBEBE",
    borderStyle: "dashed",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
    marginTop: 24,
  },
  takePictureButton: {
    backgroundColor: "#383AB2",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
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
    fontSize: 20,
    fontWeight: "600",
    color: "#2C2C2C",
    marginBottom: 16,
  },
  fileList: { flexDirection: "row" },
  fileCard: {
    width: 90,
    height: 110,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BEBEBE",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  fileName: {
    fontSize: 11,
    color: "#2C2C2C",
    textAlign: "center",
    marginTop: 6,
  },
  managePermissions: { marginTop: 16 },
  manageText: {
    fontSize: 14,
    color: "#383AB2",
    textAlign: "left",
    fontWeight: "500",
  },
  backButton: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BEBEBE",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "#2C2C2C",
    fontSize: 16,
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
