import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

type Item = {
  id: string;
  nama: string;
  harga: number;
};

export default function Cart() {
  const router = useRouter();
  const { cart } = useLocalSearchParams();

  const items: Item[] = cart ? JSON.parse(cart as string) : [];

  const total = items.reduce((sum, item) => sum + item.harga, 0);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        Keranjang
      </Text>

      <FlatList
        data={items}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderBottomWidth: 1,
              borderColor: "#ddd",
            }}
          >
            <Text>{item.nama}</Text>
            <Text>Rp {item.harga}</Text>
          </View>
        )}
      />

      <Text style={{ fontSize: 18, marginTop: 20 }}>Total: Rp {total}</Text>

      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          marginTop: 20,
          backgroundColor: "#2563eb",
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Kembali</Text>
      </TouchableOpacity>
    </View>
  );
}
