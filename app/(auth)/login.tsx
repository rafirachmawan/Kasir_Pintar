import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Aplikasi Kasir
      </Text>

      <TextInput
        placeholder="Email"
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={{ borderWidth: 1, padding: 12 }}
      />

      <TouchableOpacity
        onPress={() => router.replace("./(kasir)")}
        style={{
          backgroundColor: "#2563eb",
          padding: 16,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          LOGIN (DUMMY)
        </Text>
      </TouchableOpacity>
    </View>
  );
}
