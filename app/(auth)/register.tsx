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
  Linking,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

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

  const [paketList, setPaketList] = useState<any[]>([]);
  const [selectedPaket, setSelectedPaket] = useState<any | null>(null);

  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openPaketDropdown, setOpenPaketDropdown] = useState(false);

  const [step, setStep] = useState(1);

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailPaket, setDetailPaket] = useState<any | null>(null);

  const [users, setUsers] = useState([
    {
      email: "",
      password: "",
      role: "owner",
    },
  ]);

  const kategoriList = [
    "FNB",
    "UMKM",
    "Salon / Barbershop",
    "Apotek",
    "Bengkel",
    "Fashion",
    "Lainnya",
  ];

  function handleUserChange(
    index: number,
    field: "email" | "password" | "role",
    value: string,
  ) {
    const updated = [...users];
    updated[index][field] = value;
    setUsers(updated);
  }

  function addUser() {
    if (!selectedPaket) {
      Alert.alert("Error", "Pilih paket terlebih dahulu");
      return;
    }

    if (
      selectedPaket.maxKasir !== -1 &&
      users.length >= selectedPaket.maxKasir
    ) {
      Alert.alert("Batas Paket", "Jumlah kasir sudah mencapai batas paket");
      return;
    }

    setUsers([
      ...users,
      {
        email: "",
        password: "",
        role: "kasir",
      },
    ]);
  }

  function removeUser(index: number) {
    if (users.length === 1) return;
    setUsers(users.filter((_, i) => i !== index));
  }

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
      !telepon
    ) {
      Alert.alert("Error", "Semua field usaha wajib diisi");
      return;
    }

    if (users.length === 0) {
      Alert.alert("Error", "Minimal 1 user login");
      return;
    }

    if (
      selectedPaket.maxKasir !== -1 &&
      users.length > selectedPaket.maxKasir
    ) {
      Alert.alert("Batas Paket", "Jumlah user melebihi batas kasir pada paket");
      return;
    }

    for (const user of users) {
      if (!user.email || !user.password) {
        Alert.alert("Error", "Email dan password wajib diisi");
        return;
      }

      if (user.password.length < 6) {
        Alert.alert("Error", "Password minimal 6 karakter");
        return;
      }
    }

    try {
      setLoading(true);

      const storeId = namaToko
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-");

      const owner = users[0];

      const cred = await createUserWithEmailAndPassword(
        auth,
        owner.email,
        owner.password,
      );

      const ownerUid = cred.user.uid;

      await setDoc(doc(db, "stores", storeId), {
        name: namaToko,
        phone: telepon,
        paketId: selectedPaket.id,
        paketNama: selectedPaket.nama,
        maxKasir: selectedPaket.maxKasir,
        maxProduk: selectedPaket.maxProduk,
        kategori: finalKategori,
        alamat,
        kota,
        logoUrl: logo || null,
        isActive: false,
        hasOwner: true,
        createdAt: serverTimestamp(),
      });

      await setDoc(doc(db, "users", ownerUid), {
        email: owner.email,
        role: "owner",
        storeId,
        createdAt: serverTimestamp(),
      });

      await setDoc(doc(db, "stores", storeId, "users", ownerUid), {
        email: owner.email,
        role: "owner",
        createdAt: serverTimestamp(),
      });

      for (let i = 1; i < users.length; i++) {
        const user = users[i];

        const cred = await createUserWithEmailAndPassword(
          auth,
          user.email,
          user.password,
        );

        const uid = cred.user.uid;

        await setDoc(doc(db, "users", uid), {
          email: user.email,
          role: "kasir",
          storeId,
          createdAt: serverTimestamp(),
        });

        await setDoc(doc(db, "stores", storeId, "users", uid), {
          email: user.email,
          role: "kasir",
          createdAt: serverTimestamp(),
        });
      }

      // =====================
      // KIRIM WHATSAPP ADMIN
      // =====================

      const message = `
Halo Admin 👋

Saya sudah mendaftar aplikasi kasir.

Nama Toko : ${namaToko}
Paket : ${selectedPaket.nama}
Kota : ${kota}
No HP : ${telepon}

Mohon untuk aktivasi akun saya.
Terima kasih 🙏
`;

      const url =
        "https://wa.me/6285707185783?text=" + encodeURIComponent(message);

      await Linking.openURL(url);

      router.replace("/(auth)/login");
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
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: 10 }}
          >
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>

          <Image
            source={require("@/assets/icon.png")}
            style={{
              width: 28,
              height: 28,
              resizeMode: "contain",
              marginRight: 8,
            }}
          />

          <View>
            <Text style={styles.headerTitle}>Daftar Akun</Text>
            <Text style={styles.headerSub}>
              Buat akun dan daftarkan usaha Anda
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {step === 1 && (
            <>
              <View style={styles.hero}>
                <Text style={styles.heroTitle}>Pilih Paket</Text>
                <Text style={styles.heroSubtitle}>
                  Pilih paket terbaik untuk usaha Anda
                </Text>
              </View>

              <View style={styles.paketGrid}>
                {paketList
                  .filter((item) => item.nama)
                  .map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.85}
                      style={[
                        styles.paketCard,
                        selectedPaket?.id === item.id && styles.paketSelected,
                      ]}
                      onPress={() => {
                        setSelectedPaket(item);
                      }}
                    >
                      {/* HEADER */}
                      <LinearGradient
                        colors={
                          item.popular
                            ? ["#2563EB", "#1E40AF"]
                            : ["#F8FAFC", "#F8FAFC"]
                        }
                        style={styles.paketHeader}
                      >
                        {item.popular && (
                          <View style={styles.popularBadge}>
                            <Text style={styles.popularText}>Popular</Text>
                          </View>
                        )}

                        <Text style={styles.paketTitle}>{item.nama}</Text>

                        <Text style={styles.paketPriceBig}>
                          Rp {item.harga?.toLocaleString("id-ID")}
                        </Text>

                        <Text style={styles.paketPerText}>
                          Per outlet / bulan
                        </Text>
                      </LinearGradient>

                      {/* BODY */}
                      <View style={styles.paketBody}>
                        <Text style={styles.paketDescText} numberOfLines={3}>
                          {item.deskripsi}
                        </Text>

                        <TouchableOpacity
                          style={styles.demoButton}
                          onPress={() => {
                            setSelectedPaket(item);
                            setStep(2);
                          }}
                        >
                          <Text style={styles.demoText}>Pilih Paket</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.detailButton}
                          onPress={() => {
                            setDetailPaket(item);
                            setDetailVisible(true);
                          }}
                        >
                          <Text style={styles.detailText}>Lihat Detail</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            </>
          )}

          {step === 2 && (
            <>
              <TouchableOpacity onPress={() => setStep(1)}>
                <Text style={{ color: "#2563EB", marginBottom: 10 }}>
                  ← Ganti Paket
                </Text>
              </TouchableOpacity>

              {/* SELURUH FORM KODE KAMU TETAP SAMA */}
              {/* LOGO */}

              <View style={styles.card}>
                <View style={styles.sectionHeader}>
                  <Ionicons
                    name="image-outline"
                    size={20}
                    color="#2563EB"
                    style={{ marginRight: 8, marginTop: 1 }}
                  />
                  <Text style={styles.sectionTitle}>Logo Toko (Opsional)</Text>
                </View>

                <TouchableOpacity style={styles.uploadBox} onPress={pickLogo}>
                  {logo ? (
                    <Image source={{ uri: logo }} style={styles.logoImg} />
                  ) : (
                    <>
                      <Ionicons
                        name="image-outline"
                        size={28}
                        color="#2563EB"
                      />
                      <Text style={styles.uploadText}>Upload Logo</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* INFO USAHA */}

              <View style={styles.card}>
                <View style={styles.sectionHeader}>
                  <Ionicons
                    name="storefront-outline"
                    size={20}
                    color="#2563EB"
                    style={{ marginRight: 8, marginTop: 1 }}
                  />
                  <Text style={styles.sectionTitle}>Informasi Usaha</Text>
                </View>

                <Input
                  label="Nama Toko"
                  value={namaToko}
                  onChange={(text: string) => setNamaToko(text)}
                />

                <Text style={styles.label}>Kategori</Text>

                <TouchableOpacity
                  style={[styles.dropdown, { marginBottom: 16 }]}
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

                <Text style={[styles.label, { marginTop: 4 }]}>
                  Jenis Paket
                </Text>

                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setOpenPaketDropdown(!openPaketDropdown)}
                >
                  <Text
                    style={{ color: selectedPaket ? "#0F172A" : "#94A3B8" }}
                  >
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
                        <Text style={{ fontWeight: "700", fontSize: 14 }}>
                          {item.nama}
                        </Text>

                        <Text style={{ fontSize: 12, color: "#64748B" }}>
                          Rp {item.harga?.toLocaleString("id-ID")}
                        </Text>

                        <Text
                          style={{
                            fontSize: 11,
                            color: "#94A3B8",
                            marginTop: 2,
                          }}
                        >
                          Maks Kasir:{" "}
                          {item.maxKasir === -1 ? "Unlimited" : item.maxKasir}
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

              {/* USER LOGIN */}

              <View style={styles.card}>
                <View style={styles.sectionHeader}>
                  <Ionicons
                    name="people-outline"
                    size={20}
                    color="#2563EB"
                    style={{ marginRight: 8, marginTop: 1 }}
                  />
                  <Text style={styles.sectionTitle}>User Login</Text>
                </View>

                {users.map((user, index) => (
                  <View key={index} style={styles.userCard}>
                    <Input
                      label="Email"
                      value={user.email}
                      onChange={(v: string) =>
                        handleUserChange(index, "email", v)
                      }
                    />

                    <Input
                      label="Password"
                      value={user.password}
                      secure
                      onChange={(v: string) =>
                        handleUserChange(index, "password", v)
                      }
                    />

                    <Text style={styles.label}>Role</Text>

                    <View style={styles.roleContainer}>
                      <TouchableOpacity
                        style={[
                          styles.roleButton,
                          user.role === "owner" && styles.roleActive,
                        ]}
                        onPress={() => handleUserChange(index, "role", "owner")}
                      >
                        <Text
                          style={[
                            styles.roleText,
                            user.role === "owner" && { color: "white" },
                          ]}
                        >
                          Owner
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.roleButton,
                          user.role === "kasir" && styles.roleActive,
                        ]}
                        onPress={() => handleUserChange(index, "role", "kasir")}
                      >
                        <Text
                          style={[
                            styles.roleText,
                            user.role === "kasir" && { color: "white" },
                          ]}
                        >
                          Kasir
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {users.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeUser(index)}
                        style={{
                          backgroundColor: "#EF4444",
                          padding: 10,
                          borderRadius: 10,
                          marginTop: 10,
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: "white", fontWeight: "600" }}>
                          Hapus User
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}

                <TouchableOpacity
                  onPress={addUser}
                  disabled={
                    !!selectedPaket &&
                    selectedPaket.maxKasir !== -1 &&
                    users.length >= selectedPaket.maxKasir
                  }
                  style={{
                    backgroundColor:
                      selectedPaket &&
                      selectedPaket.maxKasir !== -1 &&
                      users.length >= selectedPaket.maxKasir
                        ? "#94A3B8"
                        : "#2563EB",
                    padding: 12,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>
                    + Tambah User
                  </Text>
                </TouchableOpacity>
              </View>

              {/* BUTTON */}

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
            </>
          )}
        </ScrollView>
      </View>
      {detailVisible && detailPaket && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{detailPaket.nama}</Text>

            <Text style={styles.modalPrice}>
              Rp {detailPaket.harga?.toLocaleString("id-ID")}
            </Text>

            <Text style={styles.modalSub}>
              Maks Kasir:{" "}
              {detailPaket.maxKasir === -1 ? "Unlimited" : detailPaket.maxKasir}
            </Text>

            <Text style={styles.modalSub}>
              Maks Produk:{" "}
              {detailPaket.maxProduk === -1
                ? "Unlimited"
                : detailPaket.maxProduk}
            </Text>

            <View style={styles.modalDivider} />

            <Text style={styles.modalDesc}>{detailPaket.deskripsi}</Text>

            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setDetailVisible(false)}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  detailButton: {
    marginTop: 8,
    paddingVertical: 8,
  },

  detailText: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "600",
  },

  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalContent: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },

  modalPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2563EB",
    marginBottom: 10,
  },

  modalSub: {
    fontSize: 13,
    color: "#64748B",
  },

  modalDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 12,
  },

  modalDesc: {
    fontSize: 13,
    color: "#334155",
    lineHeight: 20,
  },

  modalClose: {
    marginTop: 16,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  safe: { flex: 1, backgroundColor: "#F1F5F9" },
  wrapper: { flex: 1, paddingTop: STATUSBAR_HEIGHT },
  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  headerSub: {
    fontSize: 11,
    color: "#64748B",
  },
  content: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  label: { fontSize: 12, marginBottom: 6, color: "#475569" },
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
  logoImg: { width: 100, height: 100, borderRadius: 14 },
  uploadText: { marginTop: 8, color: "#2563EB", fontWeight: "600" },
  dropdown: {
    backgroundColor: "#F8FAFC",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dropdownList: {
    marginTop: 10,
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  userCard: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  roleContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },

  roleButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },

  roleActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  roleText: {
    color: "#0F172A",
    fontWeight: "600",
  },
  hero: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },

  paketGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  paketCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",

    borderWidth: 1,
    borderColor: "#E2E8F0",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  paketIcon: {
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
  },

  paketName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },

  paketPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2563EB",
  },

  paketKasir: {
    fontSize: 12,
    color: "#64748B",
  },
  paketPer: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 1,
  },

  paketDesc: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 6,
    textAlign: "center",
    lineHeight: 17,
    paddingHorizontal: 6,
  },
  paketCardActive: {
    borderWidth: 2,
    borderColor: "#2563EB",
    transform: [{ scale: 1.03 }],
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 4,
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    width: "100%",
    marginVertical: 8,
  },
  paketHeader: {
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },

  paketTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },

  paketPriceBig: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },

  paketPerText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },

  paketBody: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  paketDescText: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 18,
  },

  demoButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },

  demoText: {
    color: "white",
    fontWeight: "600",
  },

  popularBadge: {
    position: "absolute",
    top: 10,
    backgroundColor: "#2563EB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  popularText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },

  paketSelected: {
    borderColor: "#2563EB",
    borderWidth: 2,
  },

  buttonText: { color: "white", fontSize: 15, fontWeight: "700" },
});
