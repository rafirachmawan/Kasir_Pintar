import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type MenuRow = {
  label: string;
  icon: string;
  route?: string;
};

export default function Pengaturan() {
  const akun: MenuRow[] = [
    { label: "Akun", icon: "person-outline" },
    { label: "Sinkronisasi", icon: "sync-outline" },
  ];

  const konfigurasi: MenuRow[] = [
    { label: "Printer Thermal", icon: "print-outline" },
    { label: "Pemindai Barcode", icon: "scan-outline" },
    { label: "Efek Suara", icon: "volume-high-outline" },
  ];

  const dukungan: MenuRow[] = [
    { label: "Cara Menggunakan", icon: "book-outline" },
    { label: "Whatsapp", icon: "logo-whatsapp" },
    { label: "Telegram", icon: "paper-plane-outline" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pengaturan</Text>
      </View>

      {/* AKUN & SINKRONISASI */}
      <View style={styles.sectionHeader}>
        <Ionicons name="settings-outline" size={18} color="#2563EB" />
        <Text style={styles.sectionTitle}>Akun & Sinkronisasi</Text>
      </View>
      <View style={styles.card}>
        {akun.map((item, i) => (
          <Row key={i} label={item.label} icon={item.icon} />
        ))}
      </View>

      {/* KONFIGURASI */}
      <View style={styles.sectionHeader}>
        <Ionicons name="options-outline" size={18} color="#2563EB" />
        <Text style={styles.sectionTitle}>Konfigurasi</Text>
      </View>
      <View style={styles.card}>
        {konfigurasi.map((item, i) => (
          <Row key={i} label={item.label} icon={item.icon} />
        ))}
      </View>

      {/* DUKUNGAN */}
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
          <Row key={i} label={item.label} icon={item.icon} />
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/* ================= ROW ================= */

function Row({ label, icon }: { label: string; icon: string }) {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.7}>
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
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingTop: 56,
  },

  header: {
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
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

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  rowText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
