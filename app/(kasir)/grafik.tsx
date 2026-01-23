import { View, Text } from "react-native";

export default function Grafik() {
  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC", padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 16 }}>
        Grafik Penjualan
      </Text>

      <View
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          padding: 24,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#64748B" }}>
          📊 Grafik dummy (nanti bisa pakai chart)
        </Text>
      </View>
    </View>
  );
}
