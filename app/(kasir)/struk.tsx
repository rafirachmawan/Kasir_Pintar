import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  TextInput, // ⬅️ TAMBAHKAN INI
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";

/* ================= PAGE ================= */

export default function PengaturanStruk() {
  const router = useRouter();

  /* ================= STATE ================= */
  const [showLogo, setShowLogo] = useState(true);
  const [showAlamat, setShowAlamat] = useState(true);
  const [showNoHp, setShowNoHp] = useState(true);
  const [showTanggal, setShowTanggal] = useState(true);
  const [showKasir, setShowKasir] = useState(true);
  const [showPajak, setShowPajak] = useState(true);
  const [showDiskon, setShowDiskon] = useState(true);
  const [showCatatan, setShowCatatan] = useState(true);

  const [brandTitle, setBrandTitle] = useState("KASIR PINTAR");
  const [brandSubtitle, setBrandSubtitle] = useState(
    "Solusi Kasir Digital UMKM",
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2563EB" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Pengaturan Struk</Text>
      </View>

      {/* ================= PREVIEW STRUK ================= */}
      <View style={styles.preview}>
        <Text style={styles.previewTitle}>Preview Struk</Text>

        {/* HEADER TOKO */}
        {showLogo && <Text style={styles.storeName}>TOKO ANDA</Text>}
        {showAlamat && (
          <Text style={styles.storeText}>Jl. Contoh Alamat No.1</Text>
        )}
        {showNoHp && <Text style={styles.storeText}>0812-3456-7890</Text>}

        <Divider />

        {/* INFO TRANSAKSI */}
        <RowText label="No. Struk" value="TRX-001" />
        {showTanggal && <RowText label="Tanggal" value="04 Feb 2026 17:56" />}
        {showKasir && <RowText label="Kasir" value="Admin" />}

        <Divider />

        {/* ITEM */}
        <ItemRow name="Item A" qty={1} price={10000} />
        <ItemRow name="Item B" qty={2} price={10000} />

        <Divider />

        {/* RINGKASAN */}
        <RowText label="Subtotal" value="Rp 30.000" />
        {showDiskon && <RowText label="Diskon" value="- Rp 2.000" />}
        {showPajak && <RowText label="Pajak" value="Rp 1.000" />}

        <Divider />

        <RowText label="Total" value="Rp 29.000" bold />

        {showCatatan && (
          <Text style={styles.note}>Terima kasih telah berbelanja 🙏</Text>
        )}
        {/* BRAND FOOTER (SEPERTI SALESMASTER) */}
        <View style={styles.previewBrandFooter}>
          <Text style={styles.previewBrandText}>oleh {brandTitle}</Text>
          <Text style={styles.previewBrandSubText}>{brandSubtitle}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Brand Struk</Text>
      <View style={styles.card}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Nama Brand</Text>
          <TextInput
            value={brandTitle}
            onChangeText={setBrandTitle}
            placeholder="Nama brand"
            style={styles.input}
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Tagline</Text>
          <TextInput
            value={brandSubtitle}
            onChangeText={setBrandSubtitle}
            placeholder="Tagline / slogan"
            style={styles.input}
          />
        </View>
      </View>

      {/* ================= PENGATURAN ================= */}
      <Text style={styles.sectionTitle}>Tampilkan di Struk</Text>
      <View style={styles.card}>
        <Row label="Logo / Nama Toko" value={showLogo} onChange={setShowLogo} />
        <Row label="Alamat Toko" value={showAlamat} onChange={setShowAlamat} />
        <Row label="Nomor HP" value={showNoHp} onChange={setShowNoHp} />
        <Row
          label="Tanggal & Waktu"
          value={showTanggal}
          onChange={setShowTanggal}
        />
        <Row label="Nama Kasir" value={showKasir} onChange={setShowKasir} />
        <Row label="Pajak / Biaya" value={showPajak} onChange={setShowPajak} />
        <Row label="Diskon" value={showDiskon} onChange={setShowDiskon} />
        <Row label="Catatan" value={showCatatan} onChange={setShowCatatan} />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/* ================= ROW ================= */

function Row({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowText}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#CBD5E1", true: "#93C5FD" }}
        thumbColor={value ? "#2563EB" : "#F1F5F9"}
      />
    </View>
  );
}

/* ================= STYLES ================= */
function Divider() {
  return <View style={styles.divider} />;
}

function RowText({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.rowLine}>
      <Text style={[styles.leftText, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.rightText, bold && styles.bold]}>{value}</Text>
    </View>
  );
}

function ItemRow({
  name,
  qty,
  price,
}: {
  name: string;
  qty: number;
  price: number;
}) {
  return (
    <View style={{ marginBottom: 6 }}>
      <View style={styles.rowLine}>
        <Text style={styles.leftText}>{name}</Text>
        <Text style={styles.rightText}>
          Rp {(qty * price).toLocaleString("id-ID")}
        </Text>
      </View>
      <Text style={styles.itemSub}>
        {qty} x Rp {price.toLocaleString("id-ID")}
      </Text>
    </View>
  );
}

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
    marginTop: 20,
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

  rowText: {
    fontSize: 14,
    fontWeight: "500",
  },

  /* PREVIEW */
  preview: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  previewTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    color: "#2563EB",
  },

  previewText: {
    fontSize: 12,
    textAlign: "center",
  },

  previewBold: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },

  previewLine: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
  storeName: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  storeText: {
    fontSize: 12,
    textAlign: "center",
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
    borderStyle: "dashed",
    marginVertical: 10,
  },

  rowLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },

  leftText: {
    fontSize: 12,
  },

  rightText: {
    fontSize: 12,
  },

  bold: {
    fontWeight: "700",
  },

  itemSub: {
    fontSize: 11,
    color: "#64748B",
    marginLeft: 2,
  },

  note: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
    color: "#475569",
  },
  previewBrandFooter: {
    marginTop: 14,
    alignItems: "center",
  },

  previewBrandText: {
    fontSize: 11,
    color: "#64748B",
  },

  previewBrandSubText: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 2,
  },
  inputRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  inputLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
});
