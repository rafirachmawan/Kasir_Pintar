import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD = (width - 48) / 2;

export default function GrafikBisnis() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Grafik Bisnis</Text>
        <Text style={styles.subtitle}>
          Ringkasan performa bisnismu hari ini
        </Text>
      </View>

      {/* GRID INFO */}
      <View style={styles.grid}>
        <InfoCard
          title="Total Penjualan"
          value="Rp 1.250.000"
          icon="cash-outline"
          color="#2563EB"
        />
        <InfoCard
          title="Total Transaksi"
          value="12"
          icon="receipt-outline"
          color="#16A34A"
        />
        <InfoCard
          title="Rata-rata Transaksi"
          value="Rp 104.000"
          icon="analytics-outline"
          color="#F59E0B"
        />
        <InfoCard
          title="Keuntungan"
          value="Rp 350.000"
          icon="trending-up-outline"
          color="#DC2626"
        />
      </View>

      {/* SECTION DETAIL */}
      <Text style={styles.sectionTitle}>Insight Bisnis</Text>

      <View style={styles.card}>
        <InsightRow
          label="Produk Terlaris"
          value="Mie Bangladesh"
          icon="star-outline"
        />
        <InsightRow
          label="Jam Ramai"
          value="18:00 - 20:00"
          icon="time-outline"
        />
        <InsightRow
          label="Metode Pembayaran Terbanyak"
          value="Cash"
          icon="wallet-outline"
        />
        <InsightRow
          label="Diskon Digunakan"
          value="5 kali"
          icon="pricetag-outline"
        />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/* ================= COMPONENT ================= */

function InfoCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <View style={styles.infoCard}>
      <Ionicons name={icon as any} size={26} color={color} />
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function InsightRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon as any} size={18} color="#64748B" />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
    paddingTop: 56,
  },

  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },

  infoCard: {
    width: CARD,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },

  infoTitle: {
    marginTop: 10,
    fontSize: 13,
    color: "#64748B",
  },
  infoValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
    marginBottom: 8,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  rowLabel: {
    fontSize: 14,
    fontWeight: "500",
  },

  rowValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0284C7",
  },
});
