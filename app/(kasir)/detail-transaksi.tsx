import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/firebase";

export default function DetailTransaksi() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const storeId = "mie-bangladesh";

  const [data, setData] = useState<any>(null);

  async function loadDetail() {
    const ref = doc(db, "stores", storeId, "transactions", String(id));
    const snap = await getDoc(ref);
    if (snap.exists()) setData(snap.data());
  }

  useEffect(() => {
    loadDetail();
  }, []);

  if (!data) {
    return (
      <View style={styles.center}>
        <Text>Memuat transaksi...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.title}>Detail Transaksi</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* INFO */}
      <View style={styles.card}>
        <Text style={styles.label}>No. Struk</Text>
        <Text style={styles.value}>{data.receiptNumber}</Text>

        <Text style={styles.label}>Tanggal</Text>
        <Text style={styles.value}>
          {data.createdAt?.toDate().toLocaleString("id-ID")}
        </Text>

        <Text style={styles.label}>Kasir</Text>
        <Text style={styles.value}>{data.kasirName || "-"}</Text>
      </View>

      {/* ITEM */}
      <View style={styles.card}>
        <Text style={styles.section}>Item</Text>

        {data.items?.map((i: any, idx: number) => (
          <View key={idx} style={styles.row}>
            <Text>
              {i.name} x{i.qty}
            </Text>
            <Text>Rp {(i.qty * i.price).toLocaleString("id-ID")}</Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text>Total</Text>
          <Text style={styles.total}>
            Rp {data.total.toLocaleString("id-ID")}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
    paddingTop: 56,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: "700" },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  label: { fontSize: 12, color: "#64748B", marginTop: 10 },
  value: { fontSize: 14, fontWeight: "600" },
  section: { fontWeight: "700", marginBottom: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },
  total: { fontWeight: "800" },
});
