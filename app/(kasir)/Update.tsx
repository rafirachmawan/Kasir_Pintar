import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

/* ================= PAGE ================= */

export default function Update() {
  const router = useRouter();

  /* ===== DUMMY DATA ===== */
  const currentVersion = "v1.0.0";
  const latestVersion = "v1.0.0";

  const checkUpdate = () => {
    Alert.alert(
      "Cek Pembaruan",
      "Aplikasi sudah menggunakan versi terbaru 👍 (dummy)",
    );
  };

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <LinearGradient colors={["#1D4ED8", "#2563EB"]} style={styles.header}>
        {/* BACK */}
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>

        {/* TITLE */}
        <View style={{ alignItems: "center" }}>
          <Text style={styles.headerTitle}>Update Aplikasi</Text>
          <Text style={styles.headerSub}>Periksa versi terbaru aplikasi</Text>
        </View>

        {/* DUMMY */}
        <View style={{ width: 44 }} />
      </LinearGradient>

      {/* ================= CONTENT ================= */}
      <View style={styles.card}>
        {/* ICON */}
        <View style={styles.iconWrap}>
          <Ionicons name="cloud-download-outline" size={48} color="#2563EB" />
        </View>

        {/* INFO */}
        <Text style={styles.title}>Versi Aplikasi</Text>
        <Text style={styles.value}>{currentVersion}</Text>

        <Text style={styles.subText}>
          Versi terbaru saat ini: {latestVersion}
        </Text>

        {/* BUTTON */}
        <TouchableOpacity style={styles.updateBtn} onPress={checkUpdate}>
          <Ionicons name="refresh" size={18} color="white" />
          <Text style={styles.updateText}>Cek Pembaruan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  /* ===== HEADER ===== */
  header: {
    paddingTop: Platform.OS === "android" ? 48 : 64,
    paddingBottom: 28,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },

  headerSub: {
    fontSize: 12,
    color: "#DBEAFE",
    marginTop: 2,
  },

  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ===== CARD ===== */
  card: {
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },

  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 14,
    color: "#64748B",
  },

  value: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 4,
  },

  subText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 6,
    marginBottom: 24,
  },

  updateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },

  updateText: {
    color: "white",
    fontWeight: "700",
  },
});
