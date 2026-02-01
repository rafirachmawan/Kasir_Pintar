import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 56) / 2;

/* ================= TYPES ================= */

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  unit?: string;
  category?: string;
  type?: "produk" | "jasa";
};

/* ================= PAGE ================= */

export default function Penjualan() {
  const storeId = "mie-bangladesh"; // samakan dengan produk

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD PRODUCTS ================= */

  async function loadProducts() {
    try {
      const snap = await getDocs(collection(db, "stores", storeId, "products"));
      setProducts(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        })),
      );
    } catch (e) {
      console.log("LOAD PRODUCT ERROR:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  /* ================= UI ================= */

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      {/* HEADER */}
      <View
        style={{
          backgroundColor: "#0284C7",
          paddingTop: 64,
          paddingBottom: 20,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <Text style={{ color: "white", fontSize: 20, fontWeight: "700" }}>
          Penjualan
        </Text>
        <Text style={{ color: "#E0F2FE", fontSize: 14 }}>
          Pilih produk untuk ditambahkan
        </Text>
      </View>

      {/* LIST PRODUK */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0284C7"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 120,
          }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              style={{
                width: CARD_WIDTH,
                backgroundColor: "white",
                borderRadius: 16,
                marginBottom: 16,
                overflow: "hidden",
                elevation: 3,
              }}
            >
              {/* IMAGE */}
              <Image
                source={{
                  uri:
                    item.image ||
                    "https://dummyimage.com/300x200/e5e7eb/64748b&text=No+Image",
                }}
                style={{
                  width: "100%",
                  height: 120,
                  backgroundColor: "#E5E7EB",
                }}
              />

              {/* INFO */}
              <View style={{ padding: 12 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#0F172A",
                  }}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>

                <Text
                  style={{
                    color: "#0284C7",
                    fontWeight: "700",
                    marginTop: 4,
                  }}
                >
                  Rp {item.price?.toLocaleString("id-ID")}
                </Text>

                <Text
                  style={{
                    fontSize: 12,
                    color: "#64748B",
                    marginTop: 2,
                  }}
                >
                  {item.category || "Umum"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* BOTTOM BAR */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
          padding: 16,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          elevation: 10,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            backgroundColor: "#0284C7",
            paddingVertical: 16,
            borderRadius: 14,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="cart-outline" size={20} color="white" />
          <Text
            style={{
              color: "white",
              fontWeight: "600",
              fontSize: 16,
              marginLeft: 8,
            }}
          >
            Lihat Keranjang
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
