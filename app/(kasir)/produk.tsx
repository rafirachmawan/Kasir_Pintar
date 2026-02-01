import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

/* ================= TYPES ================= */

type Product = {
  id: string;
  name: string;
  type: "produk" | "jasa";
  price: number;
  unit: string;
  category: string;
  barcode: string | null;
  image?: string | null;
};

/* ================= HELPERS ================= */

function formatRupiah(value: string) {
  const number = value.replace(/\D/g, "");
  return new Intl.NumberFormat("id-ID").format(Number(number || 0));
}

/* ================= CLOUDINARY ================= */

async function uploadToCloudinary(uri: string): Promise<string> {
  const data = new FormData();

  data.append("file", {
    uri,
    type: "image/jpeg",
    name: "product.jpg",
  } as any);

  data.append("upload_preset", "kasir_pintar");
  data.append("folder", "products");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dbefoaekm/image/upload",
    { method: "POST", body: data },
  );

  const json = await res.json();

  if (!json.secure_url) {
    throw new Error("Upload Cloudinary gagal");
  }

  return json.secure_url;
}

/* ================= PAGE ================= */

export default function Produk() {
  const storeId = "mie-bangladesh";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  /* FORM */
  const [name, setName] = useState("");
  const [type, setType] = useState<"produk" | "jasa">("produk");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("Umum");
  const [barcode, setBarcode] = useState("");
  const [image, setImage] = useState<string | null>(null);

  /* ================= LOAD ================= */

  async function loadProducts() {
    try {
      const snap = await getDocs(collection(db, "stores", storeId, "products"));
      setProducts(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })),
      );
    } catch {
      Alert.alert("Error", "Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  /* ================= IMAGE ================= */

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Izin ditolak", "Akses galeri dibutuhkan");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  /* ================= ADD ================= */

  async function handleAddProduct() {
    if (!name || !price || !unit) {
      Alert.alert("Validasi", "Nama, harga, dan satuan wajib diisi");
      return;
    }

    try {
      let imageUrl: string | null = null;

      if (image) {
        imageUrl = await uploadToCloudinary(image);
      }

      await addDoc(collection(db, "stores", storeId, "products"), {
        name,
        type,
        price: Number(price),
        unit,
        category,
        barcode: barcode || null,
        image: imageUrl,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid,
      });

      setShowModal(false);
      setName("");
      setPrice("");
      setUnit("");
      setCategory("Umum");
      setBarcode("");
      setImage(null);

      loadProducts();
    } catch (e) {
      Alert.alert("Error", "Gagal menyimpan produk");
    }
  }

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>Produk</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0284C7" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{
                  uri:
                    item.image ||
                    "https://dummyimage.com/300x200/e5e7eb/64748b&text=No+Image",
                }}
                style={styles.cardImage}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.meta}>
                  {item.type.toUpperCase()} • {item.category}
                </Text>
                <Text style={styles.meta}>Satuan: {item.unit || "-"}</Text>

                <Text style={styles.price}>
                  Rp {item.price.toLocaleString("id-ID")}
                </Text>
              </View>
            </View>
          )}
        />
      )}

      {/* FLOATING BUTTON */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* ================= MODAL ================= */}

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Tambah Produk</Text>

            <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <Text style={{ color: "#64748B" }}>Upload Gambar</Text>
              )}
            </TouchableOpacity>

            <TextInput
              placeholder="Nama produk"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Harga"
              keyboardType="number-pad"
              value={price ? `Rp ${formatRupiah(price)}` : ""}
              onChangeText={(v) => setPrice(v.replace(/\D/g, ""))}
              style={styles.input}
            />
            <TextInput
              placeholder="Satuan"
              value={unit}
              onChangeText={setUnit}
              style={styles.input}
            />
            <TextInput
              placeholder="Kategori"
              value={category}
              onChangeText={setCategory}
              style={styles.input}
            />
            <TextInput
              placeholder="Barcode (opsional)"
              value={barcode}
              onChangeText={setBarcode}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleAddProduct}
            >
              <Text style={styles.buttonText}>Simpan</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.cancel}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: Platform.OS === "android" ? 48 : 64,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
  },

  /* CARD */
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    gap: 12,
  },
  cardImage: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 2,
  },
  meta: {
    fontSize: 12,
    color: "#64748B",
  },
  price: {
    marginTop: 6,
    fontWeight: "700",
    color: "#0284C7",
  },

  /* FAB */
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#0284C7",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  fabText: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    marginTop: -2,
  },

  /* MODAL */
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  imageBox: {
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  image: { width: "100%", height: "100%", borderRadius: 12 },

  primaryButton: {
    backgroundColor: "#0284C7",
    padding: 14,
    borderRadius: 14,
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  cancel: {
    textAlign: "center",
    color: "#64748B",
    marginTop: 12,
  },
});
