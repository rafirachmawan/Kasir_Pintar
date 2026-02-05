import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  TextInput,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

/* ================= FIREBASE ================= */
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

/* ================= PAGE ================= */

export default function PengaturanStruk() {
  const router = useRouter();
  const storeId = "mie-bangladesh"; // ⬅️ samakan dengan penjualan

  /* ================= STATE ================= */
  const [showLogo, setShowLogo] = useState(true);
  const [showAlamat, setShowAlamat] = useState(true);
  const [showNoHp, setShowNoHp] = useState(true);
  const [showTanggal, setShowTanggal] = useState(true);
  const [showKasir, setShowKasir] = useState(true);
  const [showPajak, setShowPajak] = useState(true);
  const [showDiskon, setShowDiskon] = useState(true);
  const [showCatatan, setShowCatatan] = useState(true);
  const [showReceiptNumber, setShowReceiptNumber] = useState(true);
  const [receiptNumberPrefix, setReceiptNumberPrefix] = useState("TRX");

  const [thankYouText, setThankYouText] = useState(
    "Terima kasih telah berbelanja 🙏",
  );

  // 🔹 ALAMAT & NO HP TOKO
  const [storeAddress, setStoreAddress] = useState("");
  const [storePhone, setStorePhone] = useState("");

  // 🔹 UNTUK HEADER STRUK (ATAS)
  const [storeTitleTop, setStoreTitleTop] = useState("TOKO ANDA");

  // 🔹 UNTUK BRAND FOOTER (BAWAH)
  const [brandFooterTitle, setBrandFooterTitle] = useState("TOKO ANDA");
  const [brandSubtitle, setBrandSubtitle] = useState("");

  /* ================= LOAD FROM FIRESTORE ================= */
  useEffect(() => {
    async function loadSetting() {
      const ref = doc(db, "stores", storeId, "settings", "receipt");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const d = snap.data();

        setShowLogo(d.showLogo ?? true);
        setShowAlamat(d.showAlamat ?? true);
        setShowNoHp(d.showNoHp ?? true);
        setShowTanggal(d.showTanggal ?? true);
        setShowKasir(d.showKasir ?? true);
        setShowPajak(d.showPajak ?? true);
        setShowDiskon(d.showDiskon ?? true);
        setShowCatatan(d.showCatatan ?? true);
        setShowReceiptNumber(d.showReceiptNumber ?? true);
        setReceiptNumberPrefix(d.receiptNumberPrefix ?? "TRX");

        setThankYouText(d.thankYouText ?? "Terima kasih telah berbelanja 🙏");

        setStoreTitleTop(d.storeTitleTop ?? "TOKO ANDA");
        setStoreAddress(d.storeAddress ?? "");
        setStorePhone(d.storePhone ?? "");

        setBrandFooterTitle(d.brandFooterTitle ?? "TOKO ANDA");
        setBrandSubtitle(d.brandSubtitle ?? "");
      }
    }

    loadSetting();
  }, []);

  /* ================= SAVE TO FIRESTORE ================= */
  async function saveSetting(data: Partial<any>) {
    const ref = doc(db, "stores", storeId, "settings", "receipt");

    await setDoc(
      ref,
      {
        showLogo,
        showAlamat,
        showNoHp,
        showTanggal,
        showKasir,
        showPajak,
        showDiskon,
        showCatatan,
        thankYouText,
        showReceiptNumber,
        receiptNumberPrefix,

        storeTitleTop,
        storeAddress,
        storePhone,
        brandFooterTitle,
        brandSubtitle,

        ...data,
        updatedAt: new Date(),
      },
      { merge: true },
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengaturan Struk</Text>
      </View>

      {/* ================= PREVIEW ================= */}
      <View style={styles.preview}>
        <Text style={styles.previewTitle}>Preview Struk</Text>

        {showLogo && <Text style={styles.storeName}>{storeTitleTop}</Text>}

        {showAlamat && storeAddress !== "" && (
          <Text style={styles.storeText}>{storeAddress}</Text>
        )}

        {showNoHp && storePhone !== "" && (
          <Text style={styles.storeText}>{storePhone}</Text>
        )}

        <Divider />

        {showReceiptNumber && (
          <RowText label="No. Struk" value={`${receiptNumberPrefix}-001`} />
        )}

        {showTanggal && <RowText label="Tanggal" value="04 Feb 2026 17:56" />}
        {showKasir && <RowText label="Kasir" value="Admin" />}

        <Divider />

        <ItemRow name="Item A" qty={1} price={10000} />
        <ItemRow name="Item B" qty={2} price={10000} />

        <Divider />

        <RowText label="Subtotal" value="Rp 30.000" />
        {showDiskon && <RowText label="Diskon" value="- Rp 2.000" />}
        {showPajak && <RowText label="Pajak" value="Rp 1.000" />}

        <Divider />

        <RowText label="Total" value="Rp 29.000" bold />

        {showCatatan && thankYouText !== "" && (
          <Text style={styles.note}>{thankYouText}</Text>
        )}

        <View style={styles.previewBrandFooter}>
          <Text style={styles.previewBrandText}>oleh {brandFooterTitle}</Text>
          <Text style={styles.previewBrandSubText}>{brandSubtitle}</Text>
        </View>
      </View>

      {/* ================= BRAND ================= */}
      <Text style={styles.sectionTitle}>Brand Struk</Text>
      <View style={styles.card}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Prefix Nomor Struk</Text>
          <TextInput
            value={receiptNumberPrefix}
            onChangeText={(v) => {
              setReceiptNumberPrefix(v);
              saveSetting({ receiptNumberPrefix: v });
            }}
            placeholder="Contoh: TRX / INV / MB"
            style={styles.input}
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Nama Toko (Header Struk)</Text>
          <TextInput
            value={storeTitleTop}
            onChangeText={(v) => {
              setStoreTitleTop(v);
              saveSetting({ storeTitleTop: v });
            }}
            style={styles.input}
          />
        </View>
        {/* 2️⃣ 👇 TEMPEL DI SINI — ALAMAT TOKO */}
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Alamat Toko</Text>
          <TextInput
            value={storeAddress}
            onChangeText={(v) => {
              setStoreAddress(v);
              saveSetting({ storeAddress: v });
            }}
            placeholder="Jl. Contoh No. 12, Jakarta"
            multiline
            style={styles.input}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Nomor HP / WhatsApp</Text>
          <TextInput
            value={storePhone}
            onChangeText={(v) => {
              setStorePhone(v);
              saveSetting({ storePhone: v });
            }}
            placeholder="08xxxxxxxxxx"
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        {/* 🔹 INI YANG SUDAH ADA (FOOTER STRUK / BAGIAN BAWAH) */}
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Nama Brand (Footer)</Text>
          <TextInput
            value={brandFooterTitle}
            onChangeText={(v) => {
              setBrandFooterTitle(v);
              saveSetting({ brandFooterTitle: v });
            }}
            style={styles.input}
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Tagline</Text>
          <TextInput
            value={brandSubtitle}
            onChangeText={(v) => {
              setBrandSubtitle(v);
              saveSetting({ brandSubtitle: v });
            }}
            style={styles.input}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Pesan Terima Kasih</Text>
          <TextInput
            value={thankYouText}
            onChangeText={(v) => {
              setThankYouText(v);
              saveSetting({ thankYouText: v });
            }}
            placeholder="Contoh: Terima kasih, semoga hari Anda menyenangkan 🙏"
            multiline
            style={[styles.input, { minHeight: 60 }]}
          />
        </View>
      </View>

      {/* ================= TOGGLE ================= */}
      <Text style={styles.sectionTitle}>Tampilkan di Struk</Text>
      <View style={styles.card}>
        <Toggle
          label="Logo / Nama Toko"
          value={showLogo}
          onChange={setShowLogo}
          save={saveSetting}
          field="showLogo"
        />
        <Toggle
          label="Alamat Toko"
          value={showAlamat}
          onChange={setShowAlamat}
          save={saveSetting}
          field="showAlamat"
        />
        <Toggle
          label="Nomor HP"
          value={showNoHp}
          onChange={setShowNoHp}
          save={saveSetting}
          field="showNoHp"
        />
        <Toggle
          label="Tanggal & Waktu"
          value={showTanggal}
          onChange={setShowTanggal}
          save={saveSetting}
          field="showTanggal"
        />
        <Toggle
          label="Nama Kasir"
          value={showKasir}
          onChange={setShowKasir}
          save={saveSetting}
          field="showKasir"
        />
        <Toggle
          label="Pajak / Biaya"
          value={showPajak}
          onChange={setShowPajak}
          save={saveSetting}
          field="showPajak"
        />
        <Toggle
          label="Diskon"
          value={showDiskon}
          onChange={setShowDiskon}
          save={saveSetting}
          field="showDiskon"
        />
        <Toggle
          label="Catatan"
          value={showCatatan}
          onChange={setShowCatatan}
          save={saveSetting}
          field="showCatatan"
        />
        <Toggle
          label="Nomor Struk"
          value={showReceiptNumber}
          onChange={setShowReceiptNumber}
          save={saveSetting}
          field="showReceiptNumber"
        />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/* ================= COMPONENTS ================= */

function Toggle({ label, value, onChange, save, field }: any) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowText}>{label}</Text>
      <Switch
        value={value}
        onValueChange={(v) => {
          onChange(v);
          save({ [field]: v });
        }}
        trackColor={{ false: "#CBD5E1", true: "#93C5FD" }}
        thumbColor={value ? "#2563EB" : "#F1F5F9"}
      />
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function RowText({ label, value, bold }: any) {
  return (
    <View style={styles.rowLine}>
      <Text style={[styles.leftText, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.rightText, bold && styles.bold]}>{value}</Text>
    </View>
  );
}

function ItemRow({ name, qty, price }: any) {
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

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
    paddingTop: 56,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: "700" },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
    marginTop: 20,
  },
  card: { backgroundColor: "white", borderRadius: 16, overflow: "hidden" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  rowText: { fontSize: 14, fontWeight: "500" },
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
  storeName: { fontSize: 14, fontWeight: "700", textAlign: "center" },
  storeText: { fontSize: 12, textAlign: "center" },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
    borderStyle: "dashed",
    marginVertical: 10,
  },
  rowLine: { flexDirection: "row", justifyContent: "space-between" },
  leftText: { fontSize: 12 },
  rightText: { fontSize: 12 },
  bold: { fontWeight: "700" },
  itemSub: { fontSize: 11, color: "#64748B" },
  note: { fontSize: 11, textAlign: "center", marginTop: 8 },
  previewBrandFooter: { marginTop: 14, alignItems: "center" },
  previewBrandText: { fontSize: 11, color: "#64748B" },
  previewBrandSubText: { fontSize: 10, color: "#94A3B8" },
  inputRow: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  inputLabel: { fontSize: 12, color: "#64748B", marginBottom: 6 },
  input: { backgroundColor: "#F8FAFC", borderRadius: 10, padding: 10 },
});
