import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

/* ================= TYPES ================= */

type StockItem = {
  id: string;
  name: string;
  status: string;
};

/* ================= PAGE ================= */

export default function Stok() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // dummy data (nanti sync produk)
  const data: StockItem[] = [
    {
      id: "1",
      name: "marlboro isi 20",
      status: "Stok Habis",
    },
  ];

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Stok</Text>

        <TouchableOpacity style={styles.scanButton}>
          <Ionicons name="scan-outline" size={22} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {/* ================= SEARCH & FILTER ================= */}
      <View style={styles.tools}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Cari"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={18} color="#111827" />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* ================= LIST ================= */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.85}>
            <View style={styles.left}>
              <View style={styles.initial}>
                <Text style={styles.initialText}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.status}>{item.status}</Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "white",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  scanButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
  },

  /* SEARCH + FILTER */
  tools: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },

  searchBox: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
  },

  filterButton: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },

  /* CARD */
  card: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  initial: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  initialText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  status: {
    fontSize: 12,
    color: "#DC2626",
    marginTop: 2,
  },
});
