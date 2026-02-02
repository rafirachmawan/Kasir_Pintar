import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type MenuRow = {
  label: string;
  icon: string;
  route: string;
};

export default function Katalog() {
  const router = useRouter();

  const items: MenuRow[] = [
    {
      label: "Daftar Item",
      icon: "albums-outline",
      route: "produk",
    },
    {
      label: "Kategori",
      icon: "people-outline",
      route: "kategori",
    },
  ];

  const inventaris: MenuRow[] = [
    {
      label: "Stok",
      icon: "file-tray-outline",
      route: "stok",
    },
    {
      label: "Supplier",
      icon: "car-outline",
      route: "supplier",
    },
  ];

  const transaksi: MenuRow[] = [
    {
      label: "Pajak, Biaya, Ongkos",
      icon: "cash-outline",
      route: "pajak", // nanti kalau belum ada, aman dulu
    },
    {
      label: "Diskon atau Potongan",
      icon: "pricetag-outline",
      route: "diskon", // opsional / next
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={26} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Katalog</Text>
      </View>

      {/* ITEMS */}
      <Text style={styles.sectionTitle}>Items</Text>
      <View style={styles.card}>
        {items.map((item, i) => (
          <Row
            key={i}
            label={item.label}
            icon={item.icon}
            onPress={() => router.push(item.route as any)}
          />
        ))}
      </View>

      {/* INVENTARIS */}
      <Text style={styles.sectionTitle}>Inventaris</Text>
      <View style={styles.card}>
        {inventaris.map((item, i) => (
          <Row
            key={i}
            label={item.label}
            icon={item.icon}
            onPress={() => router.push(item.route as any)}
          />
        ))}
      </View>

      {/* TRANSAKSI */}
      <Text style={styles.sectionTitle}>Transaksi</Text>
      <View style={styles.card}>
        {transaksi.map((item, i) => (
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

/* ================= ROW COMPONENT ================= */

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
