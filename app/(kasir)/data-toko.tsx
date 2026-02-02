import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function DataToko() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [kota, setKota] = useState("");
  const [telepon, setTelepon] = useState("");
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Informasi Toko</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* ================= CONTENT ================= */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ====== GAMBAR ====== */}
        <Text style={styles.label}>Gambar</Text>

        <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
          <Ionicons name="cloud-upload-outline" size={22} color="#2563EB" />
          <Text style={styles.uploadText}>Unggah</Text>
        </TouchableOpacity>

        {/* ====== INPUTS ====== */}
        <Text style={styles.label}>Nama Toko</Text>
        <TextInput
          placeholder="Nama Toko"
          value={nama}
          onChangeText={setNama}
          style={styles.input}
        />

        <Text style={styles.label}>Alamat</Text>
        <TextInput
          placeholder="567 Oak Ave, Boston"
          value={alamat}
          onChangeText={setAlamat}
          style={styles.input}
        />

        <Text style={styles.label}>Kota</Text>
        <TextInput
          placeholder="London"
          value={kota}
          onChangeText={setKota}
          style={styles.input}
        />

        <Text style={styles.label}>Telepon</Text>
        <TextInput
          placeholder="+1 (555) 123-4567"
          value={telepon}
          onChangeText={setTelepon}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="example@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={[styles.input, styles.inputActive]}
        />

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ================= BUTTON BAWAH ================= */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submit} activeOpacity={0.85}>
          <Text style={styles.submitText}>Perbarui</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "white",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  /* CONTENT */
  content: {
    padding: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
    color: "#111827",
  },

  /* UPLOAD */
  uploadBox: {
    height: 96,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  uploadText: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 14,
  },

  /* INPUT */
  input: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    fontSize: 14,
  },

  inputActive: {
    borderColor: "#3B82F6",
  },

  /* FOOTER */
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "#F1F5F9",
  },

  submit: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  submitText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
});
