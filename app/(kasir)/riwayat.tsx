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
  const totalIncome = transactions.reduce((sum, t) => sum + (t.total || 0), 0);
  const totalTransaction = transactions.length;

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="menu" size={22} color="#2563EB" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Transaksi</Text>

        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => setShowStartPicker(true)}
        >
          <Ionicons name="calendar-outline" size={22} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ================= TANGGAL ================= */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: "#EFF6FF" }]}
          onPress={() => setShowStartPicker(true)}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="calendar-outline" size={18} color="#2563EB" />
            <Text style={styles.cardLabel}>TANGGAL</Text>
          </View>

          <Text style={styles.dateText}>
            {startDate.toLocaleDateString("id-ID")} -{" "}
            {endDate.toLocaleDateString("id-ID")}
          </Text>
        </TouchableOpacity>

        {/* ================= DATE PICKER ================= */}
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(_, date) => {
              setShowStartPicker(false);
              if (date) {
                setStartDate(new Date(date.setHours(0, 0, 0, 0)));
                setShowEndPicker(true);
              }
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(_, date) => {
              setShowEndPicker(false);
              if (date) {
                setEndDate(new Date(date.setHours(23, 59, 59, 999)));
              }
            }}
          />
        )}

        {/* ================= SUMMARY ================= */}
        <View style={styles.summaryRow}>
          <View style={[styles.card, { flex: 1, backgroundColor: "#EFF6FF" }]}>
            <Text style={styles.cardLabel}>PENDAPATAN</Text>
            <Text style={[styles.amount, { color: "#2563EB" }]}>
              Rp {totalIncome.toLocaleString("id-ID")}
            </Text>
          </View>

          <View style={[styles.card, { flex: 1, backgroundColor: "#ECFEFF" }]}>
            <Text style={styles.cardLabel}>TRANSAKSI</Text>
            <Text style={[styles.amount, { color: "#0E7490" }]}>
              {totalTransaction}
            </Text>
          </View>
        </View>

        {/* ================= LIST ================= */}
        <Text style={styles.sectionTitle}>TRANSAKSI</Text>

        {loading ? (
          <Text style={{ textAlign: "center", color: "#64748B" }}>
            Memuat data...
          </Text>
        ) : transactions.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#64748B" }}>
            Tidak ada transaksi
          </Text>
        ) : (
          transactions.map((t) => (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.85}
              style={[
                styles.card,
                { borderLeftWidth: 5, borderLeftColor: "#2563EB" },
              ]}
              onPress={() =>
                router.push({
                  pathname: "/detail-transaksi",
                  params: { id: t.id },
                })
              }
            >
              <View style={styles.rowBetween}>
                <Text style={styles.transId}>{t.receiptNumber}</Text>
                <Text style={styles.amountSmall}>
                  Rp {t.total.toLocaleString("id-ID")}
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="calendar-outline" size={14} color="#64748B" />
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
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: 56,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  cardLabel: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 6,
    fontWeight: "600",
  },

  dateText: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "700",
  },

  summaryRow: {
    flexDirection: "row",
    gap: 12,
  },

  amount: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: "800",
  },

  amountSmall: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 8,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  transId: {
    fontSize: 16,
    fontWeight: "700",
  },

  transDate: {
    marginLeft: 6,
    fontSize: 12,
    color: "#64748B",
  },
});
