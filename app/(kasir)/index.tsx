import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const CARD = (width - 56) / 2;

export default function HomeKasir() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#E0F2FE", "#F8FAFC"]} style={{ flex: 1 }}>
      {/* HEADER */}
      <View
        style={{
          backgroundColor: "#0284C7",
          paddingTop: 56,
          paddingBottom: 80,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <Text style={{ color: "white", fontSize: 22, fontWeight: "700" }}>
          Kasirpintar
        </Text>
        <Text style={{ color: "#E0F2FE", marginTop: 4 }}>
          Kami siap membantu bisnismu
        </Text>
      </View>

      {/* CONTENT */}
      <View style={{ flex: 1, marginTop: -50, padding: 20 }}>
        {/* HERO CARD */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            padding: 20,
            elevation: 4,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "#64748B" }}>Total Penjualan Hari Ini</Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              marginVertical: 6,
            }}
          >
            Rp 1.250.000
          </Text>
          <Text style={{ color: "#16A34A" }}>+12 transaksi</Text>
        </View>

        {/* PRIMARY ACTION */}
        <TouchableOpacity
          onPress={() => router.push("penjualan" as any)}
          activeOpacity={0.9}
          style={{
            backgroundColor: "#0284C7",
            borderRadius: 18,
            padding: 18,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <View>
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              Mulai Penjualan
            </Text>
            <Text style={{ color: "#E0F2FE", fontSize: 12 }}>
              Catat transaksi sekarang
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={22} color="white" />
        </TouchableOpacity>

        {/* GRID MENU */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
          {[
            { label: "Riwayat", icon: "time-outline", route: "riwayat" },
            { label: "Produk", icon: "cube-outline", route: "produk" },
            { label: "Grafik", icon: "bar-chart-outline", route: "grafik" },
            { label: "Diskon", icon: "pricetag-outline", route: "produk" },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.85}
              style={{
                width: CARD,
                backgroundColor: "white",
                borderRadius: 18,
                padding: 16,
                elevation: 3,
              }}
            >
              <Ionicons name={item.icon as any} size={26} color="#0284C7" />
              <Text
                style={{
                  marginTop: 12,
                  fontWeight: "600",
                  fontSize: 14,
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}
