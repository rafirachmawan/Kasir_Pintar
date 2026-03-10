import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "@/firebase";

export default function DataToko() {
  const router = useRouter();

  const [storeId, setStoreId] = useState<string | null>(null);

  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("");
  const [alamat, setAlamat] = useState("");
  const [kota, setKota] = useState("");
  const [telepon, setTelepon] = useState("");
  const [email, setEmail] = useState("");
  const [paketNama, setPaketNama] = useState("");
  const [expiredAt, setExpiredAt] = useState("");

  const [users, setUsers] = useState<any[]>([]);
  async function loadStore() {
    try {
      const uid = auth.currentUser?.uid;

      if (!uid) return;

      const userSnap = await getDoc(doc(db, "users", uid));

      if (!userSnap.exists()) return;

      const data = userSnap.data();

      setStoreId(data.storeId);
    } catch (e) {
      console.log("LOAD STORE ERROR:", e);
    }
  }

  async function loadStoreData() {
    if (!storeId) return;

    try {
      const snap = await getDoc(doc(db, "stores", storeId));

      if (!snap.exists()) return;

      const data = snap.data();

      setPaketNama(data.paketNama || "");
      setExpiredAt(
        data.expiredAt?.seconds
          ? new Date(data.expiredAt.seconds * 1000).toLocaleDateString("id-ID")
          : "-",
      );

      setNama(data.name || "");
      setKategori(data.kategori || "");
      setAlamat(data.alamat || "");
      setKota(data.kota || "");
      setTelepon(data.phone || "");
      setEmail(data.email || "");
    } catch (e) {
      console.log("LOAD STORE DATA ERROR:", e);
    }
  }

  async function loadUsers() {
    if (!storeId) return;

    try {
      const snap = await getDocs(
        query(collection(db, "users"), where("storeId", "==", storeId)),
      );

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setUsers(list);
    } catch (e) {
      console.log("LOAD USERS ERROR:", e);
    }
  }

  async function handleUpdate() {
    if (!storeId) return;

    try {
      await updateDoc(doc(db, "stores", storeId), {
        name: nama,
        kategori: kategori,
        alamat: alamat,
        kota: kota,
        phone: telepon,
      });

      alert("Data toko berhasil diperbarui");
    } catch (e) {
      alert("Gagal memperbarui data toko");
    }
  }

  useEffect(() => {
    loadStore();
  }, []);

  useEffect(() => {
    if (storeId) {
      loadStoreData();
      loadUsers();
    }
  }, [storeId]);

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Informasi Toko</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* ================= CONTENT ================= */}
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ====== GAMBAR ====== */}
        <Text style={styles.label}>Gambar</Text>

        <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
          <Ionicons name="cloud-upload-outline" size={22} color="#2563EB" />
          <Text style={styles.uploadText}>Unggah</Text>
        </TouchableOpacity>

        {/* ====== INPUTS ====== */}
        <Text style={styles.label}>Nama Toko</Text>
        <TextInput
          placeholder="Nama Toko"
          value={nama}
          onChangeText={setNama}
          style={styles.input}
        />

        <Text style={styles.label}>Kategori</Text>
        <TextInput
          placeholder="Kategori usaha"
          value={kategori}
          onChangeText={setKategori}
          style={styles.input}
        />

        <Text style={styles.label}>Alamat</Text>
        <TextInput
          placeholder="567 Oak Ave, Boston"
          value={alamat}
          onChangeText={setAlamat}
          style={styles.input}
        />

        <Text style={styles.label}>Kota</Text>
        <TextInput
          placeholder="London"
          value={kota}
          onChangeText={setKota}
          style={styles.input}
        />

        <Text style={styles.label}>Telepon</Text>
        <TextInput
          placeholder="+1 (555) 123-4567"
          value={telepon}
          onChangeText={setTelepon}
          keyboardType="phone-pad"
          style={styles.input}
        />

        {/* ================= USERS ================= */}

        <View style={styles.userCard}>
          <Text style={styles.userTitle}>Pengguna Toko</Text>

          {users.map((u) => (
            <View key={u.id} style={styles.userRow}>
              <Ionicons name="person-outline" size={18} color="#64748B" />

              <View style={{ marginLeft: 10 }}>
                <Text style={styles.userName}>{u.name || "-"}</Text>

                <Text style={styles.userRole}>Role: {u.role || "-"}</Text>

                <Text style={styles.userEmail}>Email: {u.email || "-"}</Text>

                <Text style={styles.userPassword}>
                  Password: {u.password || "-"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ================= PAKET ================= */}

        <View style={styles.paketSection}>
          <Text style={styles.sectionTitle}>Paket Berlangganan Toko</Text>

          <View style={styles.paketCard}>
            <Ionicons name="diamond-outline" size={26} color="#2563EB" />

            <View style={{ marginLeft: 12 }}>
              <Text style={styles.paketTitle}>
                {paketNama || "Tidak ada paket"}
              </Text>

              <Text style={styles.paketExpired}>Aktif sampai: {expiredAt}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ================= BUTTON BAWAH ================= */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submit}
          activeOpacity={0.85}
          onPress={handleUpdate}
        >
          <Text style={styles.submitText}>Perbarui</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "white",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  /* CONTENT */
  content: {
    padding: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
    color: "#111827",
  },

  /* UPLOAD */
  uploadBox: {
    height: 96,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  uploadText: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 14,
  },

  /* INPUT */
  input: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    fontSize: 14,
  },

  inputActive: {
    borderColor: "#3B82F6",
  },

  /* FOOTER */
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "#F1F5F9",
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },

  submit: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  submitText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
  paketCard: {
    marginTop: 8,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },

  paketTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  paketExpired: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },

  userCard: {
    marginTop: 16,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
  },

  userTitle: {
    fontWeight: "700",
    marginBottom: 12,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  userName: {
    fontWeight: "600",
  },

  userRole: {
    fontSize: 12,
    color: "#64748B",
  },
  userEmail: {
    fontSize: 12,
    color: "#475569",
  },

  userPassword: {
    fontSize: 12,
    color: "#94A3B8",
  },
  paketSection: {
    marginTop: 24,
    marginBottom: 20,
  },

  sectionTitle: {
    fontWeight: "700",
    marginBottom: 10,
    fontSize: 15,
  },

  paketDesc: {
    fontSize: 12,
    color: "#64748B",
  },
});
