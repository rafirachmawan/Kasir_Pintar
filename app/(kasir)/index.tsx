import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { products, Product } from "../../data/products";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Kasir() {
  const router = useRouter();
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (item: Product) => {
    setCart((prev) => [...prev, item]);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        Daftar Produk
      </Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => addToCart(item)}
            style={{
              padding: 16,
              borderWidth: 1,
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16 }}>{item.nama}</Text>
            <Text>Rp {item.harga}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "cart" as any,
            params: { cart: JSON.stringify(cart) },
          });
        }}
        style={{
          backgroundColor: "#16a34a",
          padding: 16,
          borderRadius: 8,
          marginTop: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
          Keranjang ({cart.length})
        </Text>
      </TouchableOpacity>
    </View>
  );
}
