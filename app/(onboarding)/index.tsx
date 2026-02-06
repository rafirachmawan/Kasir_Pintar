import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import { useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
  useDerivedValue,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

/* ================= DATA ================= */

const slides = [
  {
    title: "Selamat Datang 👋",
    subtitle: "Semua transaksi rapi, cukup dari satu aplikasi",
    image: require("../../assets/onboarding/slide1.png"),
    features: [
      "⚡ Transaksi Cepat",
      "📦 Kelola Produk",
      "📊 Laporan Penjualan",
    ],
  },
  {
    title: "Mudah & Cepat",
    subtitle: "Scan, klik, selesai. Kasir gak perlu ribet",
    image: require("../../assets/onboarding/slide2.png"),
    features: [
      "🧾 Struk Digital",
      "💳 Banyak Metode Bayar",
      "📱 Mudah Digunakan",
    ],
  },
  {
    title: "Aman & Tersimpan",
    subtitle: "Data penjualan tersimpan aman dan rapi",
    image: require("../../assets/onboarding/slide3.png"),
    features: [
      "🔐 Keamanan Data",
      "☁️ Backup Otomatis",
      "📊 Riwayat Penjualan",
    ],
  },
  {
    title: "Siap Dipakai 🚀",
    subtitle: "Fokus jualan, biar sistem yang kerja",
    image: require("../../assets/onboarding/slide4.png"),
    features: ["🚀 Siap Digunakan", "🏪 Cocok UMKM", "📱 Bisa di HP"],
  },
];

/* ================= SLIDE ================= */

function OnboardingSlide({
  item,
  index,
  scrollX,
}: {
  item: any;
  index: number;
  scrollX: SharedValue<number>;
}) {
  const progress = useDerivedValue(() =>
    interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0, 1, 0],
      Extrapolate.CLAMP,
    ),
  );

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: 24 - progress.value * 24 }],
    opacity: 0.7 + progress.value * 0.3,
  }));

  return (
    <View
      style={{
        width,
        alignItems: "center",
        paddingTop: 90,
        paddingHorizontal: 28,
      }}
    >
      <Animated.Image
        source={item.image}
        style={[
          {
            width: 280,
            height: 280,
            resizeMode: "contain",
            marginBottom: 32,
          },
          imageStyle,
        ]}
      />

      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            textAlign: "center",
            color: "#FFFFFF",
          }}
        >
          {item.title}
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#E5E7EB",
            textAlign: "center",
            marginTop: 10,
            lineHeight: 22,
            maxWidth: 280,
          }}
        >
          {item.subtitle}
        </Text>

        {/* FEATURES */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: 18,
          }}
        >
          {item.features.map((f: string, i: number) => (
            <View
              key={i}
              style={{
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.35)",
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 999,
                margin: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: "#FFFFFF",
                  fontWeight: "500",
                }}
              >
                {f}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

/* ================= PAGE ================= */

export default function Onboarding() {
  const router = useRouter();
  const scrollRef = useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);
  const [index, setIndex] = useState(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const progressStyle = useAnimatedStyle(() => ({
    width: `${(scrollX.value / (width * (slides.length - 1))) * 100}%`,
  }));

  async function handleNext() {
    if (index < slides.length - 1) {
      scrollRef.current?.scrollTo({
        x: width * (index + 1),
        animated: true,
      });
    } else {
      await AsyncStorage.setItem("hasOpenedApp", "true");
      router.replace("/login");
    }
  }

  return (
    <LinearGradient
      colors={["#1E3A8A", "#1D4ED8", "#2563EB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* SKIP */}
      <TouchableOpacity
        onPress={() => router.replace("/login")}
        style={{ position: "absolute", top: 50, right: 24, zIndex: 10 }}
      >
        <Text style={{ color: "#E5E7EB", fontWeight: "500" }}>Lewati</Text>
      </TouchableOpacity>

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
      >
        {slides.map((item, i) => (
          <OnboardingSlide key={i} item={item} index={i} scrollX={scrollX} />
        ))}
      </Animated.ScrollView>

      {/* PROGRESS */}
      <View
        style={{
          alignSelf: "center",
          width: 90,
          height: 6,
          backgroundColor: "rgba(255,255,255,0.25)",
          borderRadius: 3,
          marginBottom: 20,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={[
            {
              height: "100%",
              backgroundColor: "#38BDF8",
              borderRadius: 3,
            },
            progressStyle,
          ]}
        />
      </View>

      {/* CTA */}
      <View style={{ paddingBottom: 36 }}>
        <TouchableOpacity activeOpacity={0.85} onPress={handleNext}>
          <LinearGradient
            colors={["#38BDF8", "#22D3EE"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              marginHorizontal: 24,
              paddingVertical: 16,
              borderRadius: 18,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#0F172A",
                fontSize: 16,
                fontWeight: "800",
              }}
            >
              {index === slides.length - 1
                ? "Mulai Jualan 🚀"
                : "Oke, lanjut →"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.7)",
            fontSize: 12,
            marginTop: 10,
          }}
        >
          Gratis & tanpa kartu kredit
        </Text>
      </View>
    </LinearGradient>
  );
}
