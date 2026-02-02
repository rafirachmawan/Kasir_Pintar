import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { auth } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

const { width } = Dimensions.get("window");
const CARD = (width - 56) / 2;

type UserRole = "owner" | "kasir";

type MenuItem = {
  label: string;
  icon: string;
  route: string;
  allow: UserRole[];
};

export default function HomeKasir() {
  const router = useRouter();

  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔐 AUTH + ROLE CHECK
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/(auth)/login");
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));

      if (!snap.exists()) {
        router.replace("/(auth)/login");
        return;
      }

      setRole(snap.data().role as UserRole);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 🚪 LOGOUT
  function handleLogout() {
    Alert.alert(
      "Keluar",
      "Apakah kamu yakin ingin logout?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await signOut(auth);
            router.replace("/(auth)/login");
          },
        },
      ],
      { cancelable: true },
    );
  }

  // ⏳ LOADING
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0284C7" />
      </View>
    );
  }

  // 📋 MENU GRID (SUDAH TERMASUK PENGATURAN)
  const menus: MenuItem[] = [
    {
      label: "Riwayat",
      icon: "time-outline",
      route: "riwayat",
      allow: ["owner", "kasir"],
    },
    {
      label: "Produk",
      icon: "cube-outline",
      route: "produk",
      allow: ["owner"],
    },
    {
      label: "Bisnis",
      icon: "business-outline",
      route: "bisnis",
      allow: ["owner"],
    },
    {
      label: "Katalog",
      icon: "grid-outline",
      route: "katalog",
      allow: ["owner"],
    },
    {
      label: "Pengaturan",
      icon: "settings-outline",
      route: "pengaturan",
      allow: ["owner", "kasir"],
    },
  ];

  // 🚫 GUARD NAVIGATION
  function guardedNavigate(route: string, allow: UserRole[]) {
    if (!allow.includes(role!)) {
      Alert.alert("Akses dibatasi", "Fitur ini hanya bisa diakses oleh Owner");
      return;
    }

    router.push(route as any);
  }

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
        {/* HERO */}
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
          <Text style={{ fontSize: 24, fontWeight: "700", marginVertical: 6 }}>
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
          {menus.map((item, i) => {
            const locked = !item.allow.includes(role!);

            return (
              <TouchableOpacity
                key={i}
                onPress={() => guardedNavigate(item.route, item.allow)}
                activeOpacity={0.85}
                style={{
                  width: CARD,
                  backgroundColor: "white",
                  borderRadius: 18,
                  padding: 16,
                  elevation: 3,
                  opacity: locked ? 0.6 : 1,
                }}
              >
                <Ionicons
                  name={item.icon as any}
                  size={26}
                  color={locked ? "#94A3B8" : "#0284C7"}
                />

                <Text
                  style={{
                    marginTop: 12,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  {item.label}
                </Text>

                {locked && (
                  <View
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                    }}
                  >
                    <Ionicons name="lock-closed" size={16} color="#94A3B8" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            marginTop: 32,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 14,
            borderRadius: 14,
            backgroundColor: "#FEE2E2",
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text
            style={{
              marginLeft: 8,
              color: "#DC2626",
              fontWeight: "600",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
