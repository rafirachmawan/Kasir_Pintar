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
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "@/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

/* ================= TYPES ================= */

type Category = {
  id: string;
  name: string;
  icon: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  categoryId: string;
  categoryName: string;
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

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dbefoaekm/image/upload",
    { method: "POST", body: data },
  );

  const json = await res.json();
  if (!json.secure_url) throw new Error("Upload gagal");

  return json.secure_url;
}

/* ================= PAGE ================= */

export default function Produk() {
  const storeId = "mie-bangladesh";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | "ALL">("ALL");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  /* FORM */
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [barcode, setBarcode] = useState("");
  const [image, setImage] = useState<string | null>(null);

  /* ================= LOAD DATA ================= */

  async function loadData() {
    try {
      const prodSnap = await getDocs(
        collection(db, "stores", storeId, "products"),
      );
      const catSnap = await getDocs(
        collection(db, "stores", storeId, "categories"),
      );

      setProducts(
        prodSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })),
      );
      setCategories(
        catSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })),
      );
    } catch {
      Alert.alert("Error", "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  /* ================= FILTER ================= */

  const filteredProducts =
    activeCategory === "ALL"
      ? products
      : products.filter((p) => p.categoryId === activeCategory);

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

  /* ================= ADD PRODUCT ================= */

  async function handleAddProduct() {
    if (!name || !price || !unit || !category) {
      Alert.alert("Validasi", "Lengkapi semua data wajib");
      return;
    }

    try {
      let imageUrl: string | null = null;
      if (image) imageUrl = await uploadToCloudinary(image);

      await addDoc(collection(db, "stores", storeId, "products"), {
        name,
        price: Number(price),
        unit,
        categoryId: category.id,
        categoryName: category.name,
        barcode: barcode || null,
        image: imageUrl,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid,
      });

      setShowModal(false);
      setName("");
      setPrice("");
      setUnit("");
      setCategory(null);
      setBarcode("");
      setImage(null);

      loadData();
    } catch {
      Alert.alert("Error", "Gagal menyimpan produk");
    }
  }

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produk</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0284C7" />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListHeaderComponent={
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryTabs}
            >
              <TouchableOpacity
                style={[
                  styles.categoryTab,
                  activeCategory === "ALL" && styles.categoryTabActive,
                ]}
                onPress={() => setActiveCategory("ALL")}
              >
                <Text
                  style={[
                    styles.categoryTabText,
                    activeCategory === "ALL" && styles.categoryTabTextActive,
                  ]}
                >
                  Semua
                </Text>
              </TouchableOpacity>

              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryTab,
                    activeCategory === cat.id && styles.categoryTabActive,
                  ]}
                  onPress={() => setActiveCategory(cat.id)}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={14}
                    color={activeCategory === cat.id ? "#0284C7" : "#64748B"}
                  />
                  <Text
                    style={[
                      styles.categoryTabText,
                      activeCategory === cat.id && styles.categoryTabTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          }
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
                  {item.categoryName} • {item.unit}
                </Text>
                <Text style={styles.price}>
                  Rp {item.price.toLocaleString("id-ID")}
                </Text>
              </View>
            </View>
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Ionicons name="add" size={26} color="white" />
      </TouchableOpacity>

      {/* ================= MODAL ADD PRODUCT ================= */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.sheetTitle}>Tambah Produk</Text>

              <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={28} color="#64748B" />
                    <Text style={styles.imageText}>Upload Gambar</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.field}>
                <Text style={styles.label}>Nama Produk</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Harga</Text>
                <TextInput
                  keyboardType="number-pad"
                  value={price ? `Rp ${formatRupiah(price)}` : ""}
                  onChangeText={(v) => setPrice(v.replace(/\D/g, ""))}
                  style={styles.input}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Satuan</Text>
                <TextInput
                  value={unit}
                  onChangeText={setUnit}
                  style={styles.input}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Kategori</Text>
                <TouchableOpacity
                  style={styles.select}
                  onPress={() => setShowCategoryModal(true)}
                >
                  <Text style={{ color: category ? "#0F172A" : "#94A3B8" }}>
                    {category ? category.name : "Pilih kategori"}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Barcode (Opsional)</Text>
                <TextInput
                  value={barcode}
                  onChangeText={setBarcode}
                  style={styles.input}
                />
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleAddProduct}
              >
                <Text style={styles.primaryText}>Simpan Produk</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.cancel}>Batal</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ================= CATEGORY PICKER ================= */}
      <Modal visible={showCategoryModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.categoryModal}>
            <Text style={styles.modalTitle}>Pilih Kategori</Text>
            <ScrollView>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.categoryItem}
                  onPress={() => {
                    setCategory(c);
                    setShowCategoryModal(false);
                  }}
                >
                  <Ionicons name={c.icon as any} size={18} color="#0284C7" />
                  <Text style={styles.categoryText}>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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

  title: { fontSize: 22, fontWeight: "800", marginBottom: 8 },

  categoryTabs: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },

  categoryTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
  },

  categoryTabActive: { backgroundColor: "#E0F2FE" },

  categoryTabText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  categoryTabTextActive: {
    color: "#0284C7",
    fontWeight: "700",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 8,
    marginBottom: 6,
    gap: 8,
    alignItems: "center",
  },

  cardImage: { width: 60, height: 60, borderRadius: 8 },
  cardTitle: { fontWeight: "700", fontSize: 13 },
  meta: { fontSize: 11, color: "#64748B", marginTop: 1 },
  price: { marginTop: 4, fontWeight: "700", color: "#0284C7", fontSize: 13 },

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
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },

  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingBottom: 24,
    maxHeight: "92%",
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginVertical: 12,
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },

  field: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6 },

  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 12,
  },

  select: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  imagePlaceholder: { alignItems: "center", gap: 6 },
  imageText: { fontSize: 12, color: "#64748B" },

  primaryButton: {
    backgroundColor: "#0284C7",
    padding: 14,
    borderRadius: 14,
    marginTop: 16,
  },

  primaryText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
  },

  cancel: { textAlign: "center", color: "#64748B", marginTop: 12 },

  categoryModal: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    maxHeight: "70%",
  },

  modalTitle: { fontWeight: "700", fontSize: 16, marginBottom: 12 },

  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  categoryText: { fontSize: 14, fontWeight: "500" },
});
