import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "expo-router";

export default function Riwayat() {
  const storeId = "mie-bangladesh";
  const router = useRouter();

  /* ================= STATE ================= */
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().setHours(0, 0, 0, 0)),
  );
  const [endDate, setEndDate] = useState<Date>(
    new Date(new Date().setHours(23, 59, 59, 999)),
  );

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  /* ================= LOAD TRANSAKSI ================= */
  async function loadTransactions() {
    setLoading(true);

    const ref = collection(db, "stores", storeId, "transactions");

    const q = query(
      ref,
      where("createdAt", ">=", Timestamp.fromDate(startDate)),
      where("createdAt", "<=", Timestamp.fromDate(endDate)),
    );

    const snap = await getDocs(q);

    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setTransactions(data);
    setLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, [startDate, endDate]);

  /* ================= SUMMARY ================= */
  const totalIncome = transactions.reduce((s, t) => s + (t.total || 0), 0);
  const totalTransaction = transactions.length;

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
          <Text style={styles.headerTitle}>Transaksi</Text>
          <Text style={styles.headerSub}>Riwayat penjualan toko</Text>
        </View>

        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => setShowStartPicker(true)}
        >
          <Ionicons name="calendar-outline" size={22} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ================= FILTER TANGGAL ================= */}
        <TouchableOpacity
          style={styles.dateCard}
          onPress={() => setShowStartPicker(true)}
        >
          <Ionicons name="calendar-outline" size={18} color="#2563EB" />
          <Text style={styles.dateText}>
            {startDate.toLocaleDateString("id-ID")} –{" "}
            {endDate.toLocaleDateString("id-ID")}
          </Text>
        </TouchableOpacity>

        {/* ================= DATE PICKER ================= */}
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            onChange={(_, d) => {
              setShowStartPicker(false);
              if (d) {
                setStartDate(new Date(d.setHours(0, 0, 0, 0)));
                setShowEndPicker(true);
              }
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            onChange={(_, d) => {
              setShowEndPicker(false);
              if (d) {
                setEndDate(new Date(d.setHours(23, 59, 59, 999)));
              }
            }}
          />
        )}

        {/* ================= SUMMARY ================= */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: "#EFF6FF" }]}>
            <Ionicons name="cash-outline" size={20} color="#2563EB" />
            <Text style={styles.summaryLabel}>Pendapatan</Text>
            <Text style={styles.summaryValue}>
              Rp {totalIncome.toLocaleString("id-ID")}
            </Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: "#ECFEFF" }]}>
            <Ionicons name="receipt-outline" size={20} color="#0E7490" />
            <Text style={styles.summaryLabel}>Transaksi</Text>
            <Text style={[styles.summaryValue, { color: "#0E7490" }]}>
              {totalTransaction}
            </Text>
          </View>
        </View>

        {/* ================= LIST ================= */}
        <Text style={styles.sectionTitle}>TRANSAKSI</Text>

        {loading ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.empty}>Memuat data...</Text>
          </View>
        ) : transactions.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="receipt-outline" size={40} color="#CBD5E1" />
            <Text style={styles.empty}>Belum ada transaksi</Text>
          </View>
        ) : (
          transactions.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={styles.transCard}
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: "/detail-transaksi",
                  params: { id: t.id },
                })
              }
            >
              <View style={styles.transTop}>
                <Text style={styles.transId}>{t.receiptNumber}</Text>
                <View style={styles.amountBadge}>
                  <Text style={styles.amountBadgeText}>
                    Rp {t.total.toLocaleString("id-ID")}
                  </Text>
                </View>
              </View>

              <View style={styles.transBottom}>
                <Ionicons name="time-outline" size={14} color="#64748B" />
                <Text style={styles.transDate}>
                  {t.createdAt?.toDate().toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    paddingTop: 56,
    paddingBottom: 28,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  dateCard: {
    margin: 16,
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  dateText: {
    fontSize: 15,
    fontWeight: "700",
  },

  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },

  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },

  summaryLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },

  summaryValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2563EB",
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 8,
  },

  transCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  transTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  transId: {
    fontSize: 15,
    fontWeight: "700",
  },

  amountBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  amountBadgeText: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 13,
  },

  transBottom: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  transDate: {
    marginLeft: 6,
    fontSize: 12,
    color: "#64748B",
  },

  emptyWrap: {
    alignItems: "center",
    marginTop: 40,
  },

  empty: {
    color: "#64748B",
    marginTop: 8,
  },
});
