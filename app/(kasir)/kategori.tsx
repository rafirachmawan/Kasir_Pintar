import { View, Text, StyleSheet } from "react-native";

export default function Kategori() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kategori</Text>
      <Text style={styles.desc}>
        Kelola kategori produk di sini (next: Firestore CRUD)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
    paddingTop: 56,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  desc: {
    marginTop: 12,
    color: "#64748B",
  },
});
