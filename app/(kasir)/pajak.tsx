import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type PajakItem = {
  id: string;
  name: string;
  value: string;
};

export default function Pajak() {
  const data: PajakItem[] = [
    { id: "1", name: "PPN", value: "11%" },
    { id: "2", name: "Biaya Layanan", value: "Rp 2.000" },
    { id: "3", name: "Ongkos Kirim", value: "Rp 5.000" },
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Pajak, Biaya, Ongkos</Text>
      </View>

      {/* LIST */}
      <View style={styles.card}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="cash-outline" size={20} color="#64748B" />
                <Text style={styles.rowText}>{item.name}</Text>
              </View>

              <Text style={styles.value}>{item.value}</Text>
            </View>
          )}
        />
      </View>

      {/* ADD BUTTON */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
    paddingTop: 56,
  },

  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 4,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  rowText: {
    fontSize: 14,
    fontWeight: "500",
  },

  value: {
    fontWeight: "600",
    color: "#0284C7",
  },

  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 16,
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0284C7",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
});
