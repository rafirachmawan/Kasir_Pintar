import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 64) / 3;

const menus = [
  { label: "Riwayat", icon: "time-outline", route: "riwayat" },
  { label: "Pembayaran", icon: "card-outline", route: "pembayaran" },
  { label: "Penjualan", icon: "cart-outline", route: "penjualan" },
  { label: "Grafik", icon: "bar-chart-outline", route: "grafik" },
  { label: "Diskon", icon: "pricetag-outline", route: "produk" },
  { label: "Produk", icon: "cube-outline", route: "produk" },
];

export default function HomeKasir() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#E0F2FE", "#F8FAFC"]} style={{ flex: 1 }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#0284C7",
          paddingTop: 60,
          paddingBottom: 24,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <Text style={{ color: "white", fontSize: 22, fontWeight: "700" }}>
          Kasirpintar
        </Text>
        <Text style={{ color: "#E0F2FE", fontSize: 14 }}>
          Kami siap membantu bisnismu
        </Text>
      </View>

      {/* Content */}
      <View style={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 16,
          }}
        >
          Menu Utama
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {menus.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.85}
              onPress={() => router.push(item.route as any)}
              style={{
                width: CARD_SIZE,
                height: CARD_SIZE,
                backgroundColor: "white",
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 16,
                elevation: 3,
              }}
            >
              <Ionicons name={item.icon as any} size={26} color="#0F172A" />
              <Text style={{ marginTop: 8, fontSize: 13 }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}
