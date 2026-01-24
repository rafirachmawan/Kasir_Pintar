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
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

/* ================= DATA ================= */

const slides = [
  {
    title: "Selamat Datang",
    subtitle: "Kelola transaksi lebih cepat & rapi",
    image: require("../../assets/onboarding/slide1.png"),
    features: [
      "⚡ Transaksi Cepat",
      "📦 Kelola Produk",
      "📊 Laporan Penjualan",
    ],
  },
  {
    title: "Mudah & Cepat",
    subtitle: "Catat penjualan hanya dalam hitungan detik",
    image: require("../../assets/onboarding/slide2.png"),
    features: [
      "🧾 Struk Digital",
      "💳 Banyak Metode Bayar",
      "📱 Mudah Digunakan",
    ],
  },
  {
    title: "Siap Digunakan",
    subtitle: "Fokus bisnis, kami urus sistemnya",
    image: require("../../assets/onboarding/slide3.png"),
    features: ["🔐 Aman & Stabil", "☁️ Data Tersimpan", "🚀 Siap Dipakai"],
  },
];

/* ================= SLIDE COMPONENT ================= */

function OnboardingSlide({
  item,
  index,
  scrollX,
}: {
  item: any;
  index: number;
  scrollX: SharedValue<number>;
}) {
  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollX.value,
          [(index - 1) * width, index * width, (index + 1) * width],
          [30, 0, 30],
          Extrapolate.CLAMP,
        ),
      },
    ],
    opacity: interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.5, 1, 0.5],
      Extrapolate.CLAMP,
    ),
  }));

  return (
    <View
      style={{
        width,
        alignItems: "center",
        paddingTop: 90,
        paddingHorizontal: 24,
      }}
    >
      <Animated.Image
        source={item.image}
        style={[
          {
            width: 260,
            height: 260,
            resizeMode: "contain",
            marginBottom: 24,
          },
          imageStyle,
        ]}
      />

      <View
        style={{
          backgroundColor: "white",
          borderRadius: 24,
          padding: 24,
          width: "100%",
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 20,
          elevation: 8,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            textAlign: "center",
            color: "#0F172A",
          }}
        >
          {item.title}
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#475569",
            textAlign: "center",
            marginTop: 8,
            lineHeight: 22,
          }}
        >
          {item.subtitle}
        </Text>

        <View style={{ marginTop: 16 }}>
          {item.features.map((f: string, i: number) => (
            <Text
              key={i}
              style={{
                fontSize: 14,
                color: "#334155",
                textAlign: "center",
                marginVertical: 4,
              }}
            >
              {f}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

/* ================= MAIN PAGE ================= */

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
    <LinearGradient colors={["#E0F2FE", "#F8FAFC"]} style={{ flex: 1 }}>
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
          width: 60,
          height: 6,
          backgroundColor: "#CBD5E1",
          borderRadius: 3,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            width: `${((index + 1) / slides.length) * 100}%`,
            height: "100%",
            backgroundColor: "#0284C7",
            borderRadius: 3,
          }}
        />
      </View>

      {/* CTA */}
      <View
        style={{
          backgroundColor: "white",
          paddingTop: 16,
          paddingBottom: 32,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 10,
        }}
      >
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.9}
          style={{
            backgroundColor: "#0284C7",
            marginHorizontal: 24,
            paddingVertical: 16,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
            {index === slides.length - 1 ? "Mulai Sekarang" : "Lanjut →"}
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            textAlign: "center",
            color: "#94A3B8",
            fontSize: 12,
            marginTop: 8,
          }}
        >
          Gratis & tanpa kartu kredit
        </Text>
      </View>
    </LinearGradient>
  );
}
