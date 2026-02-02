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

export default function TambahSupplier() {
  const router = useRouter();

  const [jenis, setJenis] = useState<"perorangan" | "bisnis">("perorangan");
  const [nama, setNama] = useState("");
  const [telp, setTelp] = useState("");
  const [email, setEmail] = useState("");
  const [alamat, setAlamat] = useState("");
  const [catatan, setCatatan] = useState("");

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Tambah Supplier</Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= JENIS ================= */}
        <Text style={styles.label}>Jenis</Text>

        <View style={styles.radioRow}>
          <TouchableOpacity
            style={styles.radioItem}
            onPress={() => setJenis("perorangan")}
          >
            <Ionicons
              name={
                jenis === "perorangan" ? "radio-button-on" : "radio-button-off"
              }
              size={20}
              color="#2563EB"
            />
            <Text style={styles.radioText}>Perorangan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioItem}
            onPress={() => setJenis("bisnis")}
          >
            <Ionicons
              name={jenis === "bisnis" ? "radio-button-on" : "radio-button-off"}
              size={20}
              color="#2563EB"
            />
            <Text style={styles.radioText}>Bisnis</Text>
          </TouchableOpacity>
        </View>

        {/* ================= INPUT ================= */}
        <Text style={styles.label}>Nama Supplier</Text>
        <TextInput
          placeholder="Nama Supplier"
          value={nama}
          onChangeText={setNama}
          style={styles.input}
        />

        <Text style={styles.label}>Nomor telepon</Text>
        <TextInput
          placeholder="+62xxxxxxxxxx"
          keyboardType="phone-pad"
          value={telp}
          onChangeText={setTelp}
          style={styles.input}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="example@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <Text style={styles.label}>Alamat</Text>
        <TextInput
          placeholder="Alamat"
          value={alamat}
          onChangeText={setAlamat}
          style={styles.input}
        />

        <Text style={styles.label}>Catatan</Text>
        <TextInput
          placeholder="Catatan"
          value={catatan}
          onChangeText={setCatatan}
          style={[styles.input, { height: 80 }]}
          multiline
        />

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ================= BUTTON ================= */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submit}
          activeOpacity={0.85}
          onPress={() => {
            // nanti: simpan Firestore
            router.back();
          }}
        >
          <Text style={styles.submitText}>Tambah</Text>
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

  /* RADIO */
  radioRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 8,
  },

  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  radioText: {
    fontSize: 14,
    fontWeight: "500",
  },

  /* INPUT */
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
