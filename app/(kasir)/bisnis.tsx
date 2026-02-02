import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

/* ================= ROUTE TYPE ================= */
// semua route harus ditulis eksplisit
type RoutePath =
  | "/(kasir)/data-toko"
  | "/(kasir)/struk"
  | "/(kasir)/konfigurasi-bisnis"
  | "/(kasir)/metode-pembayaran";

/* ================= TYPES ================= */

type MenuRow = {
  label: string;
  icon: string;
  route: RoutePath;
};

/* ================= PAGE ================= */

export default function Bisnis() {
  const router = useRouter();

  const bisnis: MenuRow[] = [
    {
      label: "Data Toko",
      icon: "storefront-outline",
      route: "/(kasir)/data-toko",
    },
    {
      label: "Pengaturan Struk",
      icon: "document-text-outline",
      route: "/(kasir)/struk",
    },
  ];

  const konfigurasi: MenuRow[] = [
    {
      label: "Konfigurasi Bisnis",
      icon: "settings-outline",
      route: "/(kasir)/konfigurasi-bisnis",
    },
    {
      label: "Metode Pembayaran",
      icon: "card-outline",
      route: "/(kasir)/metode-pembayaran",
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={26} color="#2563EB" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Bisnis</Text>
      </View>

      {/* ================= BISNIS ================= */}
      <Text style={styles.sectionTitle}>Bisnis</Text>
      <View style={styles.card}>
        {bisnis.map((item, i) => (
          <Row
            key={i}
            label={item.label}
            icon={item.icon}
            onPress={() => router.push(item.route as any)}
          />
        ))}
      </View>

      {/* ================= KONFIGURASI ================= */}
      <Text style={styles.sectionTitle}>Konfigurasi</Text>
      <View style={styles.card}>
        {konfigurasi.map((item, i) => (
          <Row
            key={i}
            label={item.label}
            icon={item.icon}
            onPress={() => router.push(item.route as any)}
          />
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/* ================= ROW ================= */

function Row({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
    marginBottom: 8,
    marginTop: 16,
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
