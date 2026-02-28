import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/firebase";

const { width } = Dimensions.get("window");

export default function Register() {
  const router = useRouter();

  const [logo, setLogo] = useState<string | null>(null);
  const [namaToko, setNamaToko] = useState("");
  const [kategori, setKategori] = useState("");
  const [kategoriLainnya, setKategoriLainnya] = useState("");
  const [alamat, setAlamat] = useState("");
  const [kota, setKota] = useState("");
  const [telepon, setTelepon] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [paketList, setPaketList] = useState<any[]>([]);
  const [selectedPaket, setSelectedPaket] = useState<any | null>(null);

  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openPaketDropdown, setOpenPaketDropdown] = useState(false);

  const kategoriList = [
    "FNB",
    "UMKM",
    "Salon / Barbershop",
    "Apotek",
    "Bengkel",
    "Fashion",
    "Lainnya",
  ];

  // ================= FETCH PAKET =================
  useEffect(() => {
    const fetchPaket = async () => {
      try {
        const q = query(collection(db, "paket"), where("aktif", "==", true));
        const snap = await getDocs(q);

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPaketList(data);
      } catch (err) {
        console.log("Error fetch paket:", err);
      }
    };

    fetchPaket();
  }, []);

  async function pickLogo() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setLogo(result.assets[0].uri);
    }
  }

  async function handleRegister() {
    const finalKategori = kategori === "Lainnya" ? kategoriLainnya : kategori;

    if (
      !namaToko ||
      !finalKategori ||
      !selectedPaket ||
      !alamat ||
      !kota ||
      !telepon ||
      !email ||
      !username ||
      !password
    ) {
      Alert.alert("Error", "Semua field wajib diisi kecuali logo");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      await setDoc(doc(db, "users", uid), {
        role: "owner",
        username,
        isActive: false,
        toko: {
          nama: namaToko,
          kategori: finalKategori,
          paketId: selectedPaket.id,
          paketNama: selectedPaket.nama,
          maxKasir: selectedPaket.maxKasir,
          maxProduk: selectedPaket.maxProduk,
          alamat,
          kota,
          telepon,
          email,
          logoUrl: logo,
        },
        createdAt: serverTimestamp(),
      });

      Alert.alert("Berhasil", "Pendaftaran berhasil. Tunggu aktivasi admin.", [
        { text: "OK", onPress: () => router.replace("/(auth)/login") },
      ]);
    } catch (err: any) {
      Alert.alert("Gagal daftar", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Daftar Toko</Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Logo Toko (Opsional)</Text>
            <TouchableOpacity style={styles.uploadBox} onPress={pickLogo}>
              {logo ? (
                <Image source={{ uri: logo }} style={styles.logoImg} />
              ) : (
                <>
                  <Ionicons name="image-outline" size={28} color="#2563EB" />
                  <Text style={styles.uploadText}>Upload Logo</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informasi Usaha</Text>

            <Input label="Nama Toko" value={namaToko} onChange={setNamaToko} />

            {/* KATEGORI */}
            <Text style={styles.label}>Kategori</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setOpenDropdown(!openDropdown)}
            >
              <Text style={{ color: kategori ? "#0F172A" : "#94A3B8" }}>
                {kategori || "Pilih Kategori"}
              </Text>
              <Ionicons
                name={openDropdown ? "chevron-up" : "chevron-down"}
                size={18}
                color="#64748B"
              />
            </TouchableOpacity>

            {openDropdown && (
              <View style={styles.dropdownList}>
                {kategoriList.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setKategori(item);
                      setOpenDropdown(false);
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {kategori === "Lainnya" && (
              <Input
                label="Masukkan Kategori"
                value={kategoriLainnya}
                onChange={setKategoriLainnya}
              />
            )}

            {/* ================= PAKET DROPDOWN ================= */}
            <Text style={styles.label}>Jenis Paket</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setOpenPaketDropdown(!openPaketDropdown)}
            >
              <Text style={{ color: selectedPaket ? "#0F172A" : "#94A3B8" }}>
                {selectedPaket ? selectedPaket.nama : "Pilih Paket"}
              </Text>
              <Ionicons
                name={openPaketDropdown ? "chevron-up" : "chevron-down"}
                size={18}
                color="#64748B"
              />
            </TouchableOpacity>

            {openPaketDropdown && (
              <View style={styles.dropdownList}>
                {paketList.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedPaket(item);
                      setOpenPaketDropdown(false);
                    }}
                  >
                    <Text style={{ fontWeight: "600" }}>{item.nama}</Text>
                    <Text style={{ fontSize: 12, color: "#64748B" }}>
                      Rp {item.harga?.toLocaleString("id-ID")}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Input label="Alamat" value={alamat} onChange={setAlamat} />
            <Input label="Kota" value={kota} onChange={setKota} />
            <Input
              label="No Telepon"
              value={telepon}
              onChange={setTelepon}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Akun Login</Text>

            <Input
              label="Email"
              value={email}
              onChange={setEmail}
              keyboardType="email-address"
            />
            <Input label="Username" value={username} onChange={setUsername} />
            <Input
              label="Password"
              value={password}
              onChange={setPassword}
              secure
            />
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            style={styles.button}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>DAFTAR SEKARANG</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ================= INPUT ================= */

function Input({ label, value, onChange, keyboardType, secure }: any) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={label}
        keyboardType={keyboardType}
        secureTextEntry={secure}
        style={styles.input}
      />
    </View>
  );
}

/* ================= STYLE ================= */

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F1F5F9" },
  wrapper: { flex: 1, paddingTop: STATUSBAR_HEIGHT },
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 16,
    color: "#0F172A",
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
    color: "#475569",
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    fontSize: 14,
  },
  uploadBox: {
    height: 120,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  logoImg: {
    width: 100,
    height: 100,
    borderRadius: 14,
  },
  uploadText: {
    marginTop: 8,
    color: "#2563EB",
    fontWeight: "600",
  },
  dropdown: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownList: {
    marginTop: 6,
    borderRadius: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
});
