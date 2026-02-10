import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebase";

export default function Register() {
  const router = useRouter();

  const [logo, setLogo] = useState<string | null>(null);
  const [namaToko, setNamaToko] = useState("");
  const [kategori, setKategori] = useState("");
  const [paket, setPaket] = useState("");
  const [alamat, setAlamat] = useState("");
  const [kota, setKota] = useState("");
  const [telepon, setTelepon] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function pickLogo() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setLogo(result.assets[0].uri);
    }
  }

  async function handleRegister() {
    if (
      !namaToko ||
      !kategori ||
      !paket ||
      !alamat ||
      !kota ||
      !telepon ||
      !email ||
      !username ||
      !password
    ) {
      Alert.alert("Error", "Semua field wajib diisi kecuali logo");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      await setDoc(doc(db, "users", uid), {
        role: "owner",
        username,
        isActive: false,
        toko: {
          nama: namaToko,
          kategori,
          paket,
          alamat,
          kota,
          telepon,
          email,
          logoUrl: logo,
        },
        createdAt: serverTimestamp(),
      });

      Alert.alert("Berhasil", "Pendaftaran berhasil. Tunggu aktivasi admin.", [
        { text: "OK", onPress: () => router.replace("/(auth)/login") },
      ]);
    } catch (err: any) {
      Alert.alert("Gagal daftar", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrapper}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Informasi Toko</Text>
          <View style={{ width: 22 }} />
        </View>

        {/* FORM */}
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.label}>Logo Toko</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={pickLogo}>
            {logo ? (
              <Image source={{ uri: logo }} style={styles.logoImg} />
            ) : (
              <>
                <Ionicons
                  name="cloud-upload-outline"
                  size={20}
                  color="#2563EB"
                />
                <Text style={styles.uploadText}>Unggah (Opsional)</Text>
              </>
            )}
          </TouchableOpacity>

          <Input label="Nama Toko" value={namaToko} onChange={setNamaToko} />
          <Input label="Kategori" value={kategori} onChange={setKategori} />
          <Input label="Jenis Paket" value={paket} onChange={setPaket} />
          <Input label="Alamat" value={alamat} onChange={setAlamat} />
          <Input label="Kota" value={kota} onChange={setKota} />
          <Input
            label="No Telepon"
            value={telepon}
            onChange={setTelepon}
            keyboardType="phone-pad"
          />
          <Input
            label="Email"
            value={email}
            onChange={setEmail}
            keyboardType="email-address"
          />
          <Input
            label="Username Login"
            value={username}
            onChange={setUsername}
          />
          <Input
            label="Password Login"
            value={password}
            onChange={setPassword}
            secure
          />

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            style={styles.button}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>SIMPAN</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ================= REUSABLE INPUT ================= */

function Input({
  label,
  value,
  onChange,
  keyboardType,
  secure,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboardType?: any;
  secure?: boolean;
}) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={label}
        keyboardType={keyboardType}
        secureTextEntry={secure}
        style={styles.input}
      />
    </>
  );
}

/* ================= STYLE ================= */

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  wrapper: {
    flex: 1,
    paddingTop: STATUSBAR_HEIGHT,
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  label: {
    fontSize: 12,
    color: "#334155",
    marginBottom: 6,
    marginTop: 12,
  },
  uploadBox: {
    height: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    fontSize: 13,
    color: "#2563EB",
    marginTop: 4,
  },
  logoImg: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
});
