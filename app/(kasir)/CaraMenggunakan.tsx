import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

/* ================= PAGE ================= */

export default function CaraMenggunakan() {
  const router = useRouter();

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
          <Text style={styles.headerTitle}>Cara Menggunakan</Text>
          <Text style={styles.headerSub}>
            Panduan penggunaan aplikasi kasir
          </Text>
        </View>

        <View style={{ width: 44 }} />
      </LinearGradient>

      {/* ================= CONTENT ================= */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Guide
          title="1. Menambah Produk"
          steps={[
            "Masuk ke menu Produk",
            "Klik tombol Tambah Produk",
            "Isi nama, harga, dan stok",
            "Klik Simpan",
          ]}
        />

        <Guide
          title="2. Melakukan Transaksi"
          steps={[
            "Masuk ke menu Kasir",
            "Pilih produk yang dibeli",
            "Klik tombol Bayar",
            "Pilih metode pembayaran",
          ]}
        />

        <Guide
          title="3. Mencetak Struk"
          steps={[
            "Pastikan printer thermal aktif",
            "Selesaikan transaksi",
            "Struk akan tercetak otomatis",
          ]}
        />

        <Guide
          title="4. Melihat Laporan"
          steps={[
            "Masuk ke menu Riwayat / Laporan",
            "Pilih rentang tanggal",
            "Lihat detail penjualan",
          ]}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

/* ================= COMPONENT ================= */

function Guide({ title, steps }: { title: string; steps: string[] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>

      {steps.map((step, index) => (
        <View key={index} style={styles.stepRow}>
          <Text style={styles.stepNumber}>{index + 1}.</Text>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  /* HEADER */
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

  /* CONTENT */
  content: {
    paddingHorizontal: 16,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },

  stepNumber: {
    width: 20,
    fontWeight: "700",
    color: "#2563EB",
  },

  stepText: {
    flex: 1,
    fontSize: 14,
    color: "#334155",
  },
});
