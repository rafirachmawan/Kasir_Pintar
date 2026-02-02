import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type DiskonItem = {
  id: string;
  name: string;
  type: "persen" | "nominal";
  value: string;
};

export default function Diskon() {
  const data: DiskonItem[] = [
    { id: "1", name: "Diskon Member", type: "persen", value: "10%" },
    { id: "2", name: "Promo Lebaran", type: "nominal", value: "Rp 5.000" },
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Diskon / Potongan</Text>
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
                <Ionicons name="pricetag-outline" size={20} color="#64748B" />
                <View>
                  <Text style={styles.rowText}>{item.name}</Text>
                  <Text style={styles.meta}>
                    {item.type === "persen"
                      ? "Diskon Persentase"
                      : "Potongan Nominal"}
                  </Text>
                </View>
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

  meta: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },

  value: {
    fontWeight: "700",
    color: "#16A34A",
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
