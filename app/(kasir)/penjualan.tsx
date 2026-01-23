import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 56) / 2; // 2 kolom

// ==================
// DUMMY PRODUK
// ==================
const dummyProducts = [
  {
    id: "1",
    name: "Snack Coklat",
    price: 15000,
    image: "https://via.placeholder.com/150",
    stock: 20,
  },
  {
    id: "2",
    name: "Minuman Botol",
    price: 8000,
    image: "https://via.placeholder.com/150",
    stock: 35,
  },
  {
    id: "3",
    name: "Mie Instan",
    price: 3500,
    image: "https://via.placeholder.com/150",
    stock: 50,
  },
  {
    id: "4",
    name: "Roti Tawar",
    price: 12000,
    image: "https://via.placeholder.com/150",
    stock: 15,
  },
];

export default function Penjualan() {
  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      {/* HEADER */}
      <View
        style={{
          backgroundColor: "#0284C7",
          paddingTop: 60,
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
      <FlatList
        data={dummyProducts}
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
              source={{ uri: item.image }}
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
                Rp {item.price.toLocaleString()}
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: "#64748B",
                  marginTop: 2,
                }}
              >
                Stok: {item.stock}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

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
