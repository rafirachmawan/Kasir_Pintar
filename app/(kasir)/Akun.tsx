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

export default function Akun() {
  const router = useRouter();

  /* ===== DUMMY DATA ===== */
  const jenisBisnis = "Solo";
  const paket = "Paket Gratis";
  const transaksiDipakai = 1;
  const transaksiLimit = 30;
  const persen = Math.round((transaksiDipakai / transaksiLimit) * 100);
  const idBisnis = "XVR-TDK-HKX-WJ2";

  const copyId = () => {
    Alert.alert("Disalin", "ID Bisnis berhasil disalin");
  };

  const logout = () => {
    Alert.alert("Keluar", "Berhasil logout (dummy)");
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
          <Text style={styles.headerTitle}>Akun</Text>
          <Text style={styles.headerSub}>Informasi akun & langganan</Text>
        </View>

        {/* DUMMY */}
        <View style={{ width: 44 }} />
      </LinearGradient>

      {/* ================= CARD ================= */}
      <View style={styles.card}>
        {/* JENIS BISNIS */}
        <Item label="Jenis Bisnis" value={jenisBisnis} />

        <Divider />

        {/* PAKET */}
        <Item label="Paket Berlangganan" value={paket} />

        <Divider />

        {/* BATAS TRANSAKSI */}
        <Text style={styles.label}>Batas Transaksi Bulanan</Text>

        <View style={styles.rowBetween}>
          <Text style={styles.value}>
            {transaksiDipakai} / {transaksiLimit}
          </Text>
          <Text style={styles.percent}>{persen}%</Text>
        </View>

        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${persen}%` }]} />
        </View>

        <Text style={styles.subText}>
          {transaksiLimit - transaksiDipakai} transactions remaining this month
        </Text>

        <Divider />

        {/* ID BISNIS */}
        <Text style={styles.label}>ID Bisnis</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.value}>{idBisnis}</Text>
          <TouchableOpacity onPress={copyId}>
            <Ionicons name="copy-outline" size={18} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* KELUAR */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>

        {/* MORE */}
        <TouchableOpacity>
          <Text style={styles.moreText}>Tampilkan lebih banyak</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= COMPONENT ================= */

function Item({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.valueBlue}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
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
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
  },

  label: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 4,
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  valueBlue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2563EB",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },

  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  percent: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "600",
  },

  progressBg: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginTop: 8,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 4,
  },

  subText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 6,
  },

  logoutBtn: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#F97316",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  logoutText: {
    color: "#F97316",
    fontWeight: "700",
  },

  moreText: {
    marginTop: 16,
    textAlign: "center",
    color: "#2563EB",
    fontWeight: "600",
  },
});
