import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <LinearGradient
      colors={["#E0F2FE", "#F8FAFC"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: "center",
          padding: 20,
        }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Card */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 18,
            padding: 22,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          {/* Brand */}
          <Text
            style={{
              fontSize: 26,
              fontWeight: "700",
              color: "#0284C7",
              textAlign: "center",
              marginBottom: 4,
            }}
          >
            Kasirpintar
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: "#64748B",
              textAlign: "center",
              marginBottom: 22,
            }}
          >
            Kelola bisnismu pakai cara pintar
          </Text>

          {/* Email */}
          <Text style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>
            EMAIL / HP
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email / no telepon"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 12,
              padding: 14,
              fontSize: 14,
              marginBottom: 14,
              backgroundColor: "#F8FAFC",
            }}
          />

          {/* Password */}
          <Text style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>
            SANDI
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 12,
              paddingHorizontal: 12,
              backgroundColor: "#F8FAFC",
            }}
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Sandi"
              secureTextEntry={!showPassword}
              style={{
                flex: 1,
                paddingVertical: 14,
                fontSize: 14,
              }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>
          </View>

          {/* Forgot */}
          <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: 10 }}>
            <Text style={{ fontSize: 13, color: "#0284C7" }}>Lupa Sandi?</Text>
          </TouchableOpacity>

          {/* Button */}
          <TouchableOpacity
            onPress={() => router.replace("/(kasir)")}
            activeOpacity={0.9}
            style={{
              backgroundColor: "#0284C7",
              paddingVertical: 14,
              borderRadius: 14,
              marginTop: 20,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              MASUK
            </Text>
          </TouchableOpacity>

          {/* Register */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 16,
            }}
          >
            <Text style={{ fontSize: 13, color: "#475569" }}>
              Belum mendaftar?{" "}
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 13,
                  color: "#0284C7",
                  fontWeight: "600",
                }}
              >
                Daftar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
