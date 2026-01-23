import { View, Text, TouchableOpacity, FlatList } from "react-native";

const dummyCart = [
  { id: "1", name: "Kopi Susu", price: 12000 },
  { id: "2", name: "Roti Bakar", price: 15000 },
];

export default function Penjualan() {
  const total = dummyCart.reduce((a, b) => a + b.price, 0);

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC", padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 16 }}>
        Penjualan
      </Text>

      <FlatList
        data={dummyCart}
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
            <Text style={{ fontSize: 15 }}>{item.name}</Text>
            <Text style={{ color: "#0284C7" }}>
              Rp {item.price.toLocaleString()}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#0284C7",
          padding: 16,
          borderRadius: 14,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          BAYAR — Rp {total.toLocaleString()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
