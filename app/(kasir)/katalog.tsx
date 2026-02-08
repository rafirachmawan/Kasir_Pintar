import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

/* ================= TYPES ================= */

type MenuRow = {
  label: string;
  icon: string;
  route: string;
};

/* ================= PAGE ================= */

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
      route: "pajak",
    },
    {
      label: "Diskon atau Potongan",
      icon: "pricetag-outline",
      route: "diskon",
    },
  ];

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
          <Text style={styles.headerTitle}>Katalog</Text>
          <Text style={styles.headerSub}>Manajemen katalog toko</Text>
        </View>

        {/* DUMMY */}
        <View style={{ width: 44 }} />
      </LinearGradient>

      {/* ================= CONTENT ================= */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
    </View>
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
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

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
