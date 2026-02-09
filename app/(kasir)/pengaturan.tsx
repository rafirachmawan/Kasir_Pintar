import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

/* ================= TYPES ================= */

type MenuRoute =
  | "/(kasir)/Akun"
  | "/(kasir)/Update"
  | "/(kasir)/CaraMenggunakan";

type MenuRow = {
  label: string;
  icon: string;
  route?: MenuRoute;
  external?: () => void;
};

/* ================= PAGE ================= */

export default function Pengaturan() {
  const router = useRouter();

  /* ===== WHATSAPP HANDLER ===== */
  const openWhatsApp = () => {
    const phone = "6285707185783";
    const message = "Halo, saya butuh bantuan terkait aplikasi kasir.";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  /* ===== AKUN & UPDATE ===== */
  const akun: MenuRow[] = [
    {
      label: "Akun",
      icon: "person-outline",
      route: "/(kasir)/Akun",
    },
    {
      label: "Update",
      icon: "refresh-outline",
      route: "/(kasir)/Update",
    },
  ];

  /* ===== KONFIGURASI ===== */
  const konfigurasi: MenuRow[] = [
    { label: "Printer Thermal", icon: "print-outline" },
  ];

  /* ===== DUKUNGAN ===== */
  const dukungan: MenuRow[] = [
    {
      label: "Cara Menggunakan",
      icon: "book-outline",
      route: "/(kasir)/CaraMenggunakan",
    },
    {
      label: "Whatsapp",
      icon: "logo-whatsapp",
      external: openWhatsApp,
    },
  ];

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <LinearGradient colors={["#1D4ED8", "#2563EB"]} style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Text style={styles.headerTitle}>Pengaturan</Text>
          <Text style={styles.headerSub}>
            Preferensi & konfigurasi aplikasi
          </Text>
        </View>

        <View style={{ width: 44 }} />
      </LinearGradient>

      {/* ================= CONTENT ================= */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== AKUN & UPDATE ===== */}
        <View style={styles.card}>
          {akun.map((item, i) => (
            <Row key={i} {...item} />
          ))}
        </View>

        {/* ===== KONFIGURASI ===== */}
        <View style={styles.sectionHeader}>
          <Ionicons name="options-outline" size={18} color="#2563EB" />
          <Text style={styles.sectionTitle}>Konfigurasi</Text>
        </View>

        <View style={styles.card}>
          {konfigurasi.map((item, i) => (
            <Row key={i} {...item} />
          ))}
        </View>

        {/* ===== DUKUNGAN ===== */}
        <View style={styles.sectionHeader}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={18}
            color="#2563EB"
          />
          <Text style={styles.sectionTitle}>Dukungan</Text>
        </View>

        <View style={styles.card}>
          {dukungan.map((item, i) => (
            <Row key={i} {...item} />
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

/* ================= ROW ================= */

function Row({ label, icon, route, external }: MenuRow) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.7}
      onPress={() => {
        if (route) router.push(route);
        else if (external) external();
      }}
    >
      <View style={styles.rowLeft}>
        <Ionicons name={icon as any} size={20} color="#64748B" />
        <Text style={styles.rowText}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </TouchableOpacity>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { paddingHorizontal: 16, paddingTop: 16 },

  header: {
    paddingTop: Platform.OS === "android" ? 48 : 64,
    paddingBottom: 28,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  headerTitle: { fontSize: 20, fontWeight: "700", color: "white" },
  headerSub: { fontSize: 12, color: "#DBEAFE", marginTop: 2 },

  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
  },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowText: { fontSize: 14, fontWeight: "500" },
});
