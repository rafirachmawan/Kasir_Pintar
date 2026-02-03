import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Alert,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

/* ================= TYPES ================= */

type Product = {
  id: string;
  name: string;
  stock?: number;
  unlimited?: boolean;
};

/* ================= PAGE ================= */

export default function Stok() {
  const router = useRouter();
  const storeId = "mie-bangladesh";

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addStock, setAddStock] = useState("");
  const [isUnlimited, setIsUnlimited] = useState(false);

  /* ================= LOAD PRODUCTS ================= */

  async function loadProducts() {
    try {
      const snap = await getDocs(collection(db, "stores", storeId, "products"));

      setProducts(
        snap.docs.map((d) => ({
          id: d.id,
          name: d.data().name,
          stock: d.data().stock ?? 0,
          unlimited: d.data().unlimited ?? false,
        })),
      );
    } catch {
      Alert.alert("Error", "Gagal memuat produk");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  /* ================= SAVE STOCK ================= */

  async function handleSaveStock() {
    if (!selectedProduct) return;

    try {
      const ref = doc(db, "stores", storeId, "products", selectedProduct.id);

      if (isUnlimited) {
        await updateDoc(ref, {
          unlimited: true,
        });
      } else {
        await updateDoc(ref, {
          unlimited: false,
          stock: (selectedProduct.stock ?? 0) + Number(addStock || 0),
        });
      }

      setSelectedProduct(null);
      setAddStock("");
      setIsUnlimited(false);
      loadProducts();
    } catch {
      Alert.alert("Error", "Gagal menyimpan stok");
    }
  }

  /* ================= FILTER ================= */

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Stok</Text>

        <TouchableOpacity style={styles.scanButton}>
          <Ionicons name="scan-outline" size={22} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {/* ================= SEARCH ================= */}
      <View style={styles.tools}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Cari produk"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* ================= LIST ================= */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => {
              setSelectedProduct(item);
              setIsUnlimited(item.unlimited ?? false);
              setAddStock("");
            }}
          >
            <View style={styles.left}>
              <View style={styles.initial}>
                <Text style={styles.initialText}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text
                  style={[
                    styles.status,
                    {
                      color:
                        item.unlimited || item.stock! > 0
                          ? "#16A34A"
                          : "#DC2626",
                    },
                  ]}
                >
                  {item.unlimited ? "Stok: Unlimited" : `Stok: ${item.stock}`}
                </Text>
              </View>
            </View>

            <Ionicons name="settings-outline" size={20} color="#2563EB" />
          </TouchableOpacity>
        )}
      />

      {/* ================= MODAL STOCK ================= */}
      <Modal visible={!!selectedProduct} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Atur Stok</Text>

            <Text style={styles.modalProduct}>{selectedProduct?.name}</Text>

            {/* Unlimited Toggle */}
            <View style={styles.unlimitedRow}>
              <Text style={styles.unlimitedText}>Stok Unlimited</Text>
              <Switch value={isUnlimited} onValueChange={setIsUnlimited} />
            </View>

            {!isUnlimited && (
              <TextInput
                placeholder="Tambah jumlah stok"
                keyboardType="number-pad"
                value={addStock}
                onChangeText={setAddStock}
                style={styles.stockInput}
              />
            )}

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveStock}
            >
              <Text style={styles.saveText}>Simpan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSelectedProduct(null);
                setAddStock("");
                setIsUnlimited(false);
              }}
            >
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
    backgroundColor: "#F1F5F9",
  },

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
  },

  scanButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
  },

  tools: {
    paddingHorizontal: 16,
    marginTop: 12,
  },

  searchBox: {
    height: 44,
    borderRadius: 12,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
  },

  card: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  initial: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  initialText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
  },

  status: {
    fontSize: 12,
    marginTop: 2,
  },

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
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  modalProduct: {
    textAlign: "center",
    marginVertical: 8,
    fontWeight: "600",
  },

  unlimitedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },

  unlimitedText: {
    fontSize: 14,
    fontWeight: "500",
  },

  stockInput: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },

  saveButton: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 14,
    marginTop: 16,
  },

  saveText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
  },

  cancel: {
    textAlign: "center",
    marginTop: 12,
    color: "#64748B",
  },
});
