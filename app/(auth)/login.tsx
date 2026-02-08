import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { Image } from "react-native";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Error", "Email dan sandi wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      const userSnap = await getDoc(doc(db, "users", uid));

      if (!userSnap.exists()) {
        Alert.alert(
          "Akun belum terdaftar",
          "Akun ini belum didaftarkan oleh admin toko",
        );
        return;
      }

      if (userSnap.data().isActive === false) {
        Alert.alert(
          "Akun belum aktif",
          "Akun ini belum diaktifkan oleh admin toko",
        );
        return;
      }

      router.replace("/(kasir)");
    } catch (err: any) {
      Alert.alert("Login gagal", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={["#1E3A8A", "#1D4ED8", "#2563EB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* ================= HEADER ================= */}
      <View
        style={{
          paddingTop: 64, // ⬅️ DIPERKECIL (AWALNYA 90)
          paddingBottom: 28, // ⬅️ LEBIH RINGKAS
          paddingHorizontal: 24,
          alignItems: "center",
        }}
      >
        {/* LOGO */}
        <Image
          source={require("@/assets/icon.png")}
          style={{
            width: 100, // ⬅️ SEDIKIT LEBIH KECIL
            height: 100,
            resizeMode: "contain",
            marginBottom: 12, // ⬅️ DIPERPET
          }}
        />

        {/* BRAND */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 28, // ⬅️ SEDIKIT DIPERKECIL
              fontWeight: "800",
              color: "#FFFFFF",
            }}
          >
            Kasir
          </Text>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: "#38BDF8",
            }}
          >
            Pintar
          </Text>
        </View>

        {/* TAGLINE */}
        <Text
          style={{
            color: "#E5E7EB",
            marginTop: 6, // ⬅️ LEBIH DEKAT
            fontSize: 13,
            textAlign: "center",
            maxWidth: 280,
            lineHeight: 18,
          }}
        >
          Sistem kasir modern untuk operasional bisnis harian
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
          }}
        >
          {/* ================= LOGIN CARD ================= */}
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 24,
              padding: 24,
              elevation: 10,
              marginTop: 8, // ⬅️ KUNCI: NAIKKAN BOX LOGIN
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#0F172A",
                marginBottom: 4,
              }}
            >
              Masuk ke aplikasi
            </Text>

            <Text
              style={{
                fontSize: 13,
                color: "#64748B",
                marginBottom: 20,
              }}
            >
              Gunakan akun yang sudah didaftarkan admin
            </Text>

            {/* EMAIL */}
            <Text style={label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="email@contoh.com"
              autoCapitalize="none"
              keyboardType="email-address"
              style={input}
            />

            {/* PASSWORD */}
            <Text style={label}>Sandi</Text>
            <View style={passwordWrapper}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Masukkan sandi"
                secureTextEntry={!showPassword}
                style={{ flex: 1, paddingVertical: 14 }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            {/* BUTTON */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={{
                backgroundColor: "#0284C7",
                paddingVertical: 16,
                borderRadius: 16,
                marginTop: 24,
                alignItems: "center",
              }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "700",
                  }}
                >
                  MASUK
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* FOOTER (TIDAK DIUBAH) */}
          <Text
            style={{
              textAlign: "center",
              color: "#CBD5E1",
              fontSize: 12,
              marginTop: 28,
            }}
          >
            © {new Date().getFullYear()} KasirPintar
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

/* ================= STYLE ================= */

const label = {
  fontSize: 12,
  color: "#475569",
  marginBottom: 6,
};

const input = {
  borderWidth: 1,
  borderColor: "#CBD5E1",
  borderRadius: 14,
  padding: 14,
  fontSize: 14,
  marginBottom: 16,
  backgroundColor: "#F8FAFC",
};

const passwordWrapper = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  borderWidth: 1,
  borderColor: "#CBD5E1",
  borderRadius: 14,
  paddingHorizontal: 12,
  backgroundColor: "#F8FAFC",
};
