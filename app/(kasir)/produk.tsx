import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useState } from "react";

export default function Produk() {
  const [products, setProducts] = useState([
    { id: "1", name: "Kopi Susu", price: 12000 },
    { id: "2", name: "Roti Bakar", price: 15000 },
  ]);

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC", padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 16 }}>
        Produk
      </Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "white",
              padding: 14,
              borderRadius: 12,
              marginBottom: 10,
            }}
          >
            <Text>{item.name}</Text>
            <Text style={{ color: "#0284C7" }}>
              Rp {item.price.toLocaleString()}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#0284C7",
          padding: 14,
          borderRadius: 14,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          + Tambah Produk
        </Text>
      </TouchableOpacity>
    </View>
  );
}
