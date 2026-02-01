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
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/firebase";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ⚠️ LOGIKA TIDAK DIUBAH
  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Error", "Email dan sandi wajib diisi");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ AUTH
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      // 2️⃣ AMBIL MASTER USER
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const snap = await getDocs(q);

      if (snap.empty) {
        Alert.alert(
          "Akun belum terdaftar",
          "Akun ini belum didaftarkan oleh admin toko",
        );
        return;
      }

      const user = snap.docs[0].data();

      if (user.isActive === false) {
        Alert.alert(
          "Akun belum aktif",
          "Akun ini belum diaktifkan oleh admin toko",
        );
        return;
      }

      // 3️⃣ SIMPAN ROLE (GLOBAL STATE / CONTEXT / STORE)
      // contoh pakai expo-router params / zustand / context
      // sementara langsung redirect

      router.replace("/(kasir)"); // ⬅️ SEMUA MASUK SINI
    } catch (err: any) {
      Alert.alert("Login gagal", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={["#E0F2FE", "#BAE6FD", "#F8FAFC"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* HEADER BRAND */}
      <View
        style={{
          paddingTop: 72,
          paddingBottom: 40,
          paddingHorizontal: 24,
        }}
      >
        <Text
          style={{
            color: "#0284C7",
            fontSize: 32,
            fontWeight: "800",
          }}
        >
          KasirPintar
        </Text>
        <Text
          style={{
            color: "#475569",
            marginTop: 6,
            fontSize: 14,
            maxWidth: 260,
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
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* LOGIN CARD */}
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 24,
              padding: 24,
              shadowColor: "#0284C7",
              shadowOpacity: 0.12,
              shadowRadius: 24,
              elevation: 8,
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

          {/* FOOTER */}
          <Text
            style={{
              textAlign: "center",
              color: "#64748B",
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

/* ===== STYLE ===== */

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
