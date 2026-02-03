import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";

/* ================= TYPES ================= */

type DiscountItem = {
  id: string;
  name: string;
  type: "percent" | "fixed";
  value: number;
};

/* ================= PAGE ================= */

export default function Diskon() {
  const storeId = "mie-bangladesh";

  const [data, setData] = useState<DiscountItem[]>([]);
  const [loading, setLoading] = useState(true);

  /* modal */
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState("");

  /* ================= LOAD ================= */

  async function loadDiscounts() {
    try {
      const snap = await getDocs(
        collection(db, "stores", storeId, "discounts"),
      );

      setData(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })),
      );
    } catch {
      Alert.alert("Error", "Gagal memuat diskon");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDiscounts();
  }, []);

  /* ================= ADD ================= */

  async function handleAdd() {
    if (!name || !value) {
      Alert.alert("Validasi", "Nama dan nilai wajib diisi");
      return;
    }

    try {
      await addDoc(collection(db, "stores", storeId, "discounts"), {
        name,
        type,
        value: Number(value),
        active: true,
        createdAt: serverTimestamp(),
      });

      setShowModal(false);
      setName("");
      setValue("");
      setType("percent");
      loadDiscounts();
    } catch {
      Alert.alert("Error", "Gagal menambahkan diskon");
    }
  }

  /* ================= FORMAT ================= */

  function formatValue(item: DiscountItem) {
    return item.type === "percent"
      ? `${item.value}%`
      : `Rp ${item.value.toLocaleString("id-ID")}`;
  }

  function formatMeta(item: DiscountItem) {
    return item.type === "percent" ? "Diskon Persentase" : "Potongan Nominal";
  }

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Diskon / Potongan</Text>
      </View>

      {/* LIST */}
      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator style={{ marginVertical: 20 }} />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <Text style={styles.empty}>Belum ada diskon</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Ionicons name="pricetag-outline" size={20} color="#64748B" />
                  <View>
                    <Text style={styles.rowText}>{item.name}</Text>
                    <Text style={styles.meta}>{formatMeta(item)}</Text>
                  </View>
                </View>

                <Text style={styles.value}>{formatValue(item)}</Text>
              </View>
            )}
          />
        )}
      </View>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Ionicons name="add" size={26} color="white" />
      </TouchableOpacity>

      {/* ================= MODAL ADD ================= */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Tambah Diskon</Text>

            <TextInput
              placeholder="Nama Diskon"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            {/* TYPE */}
            <View style={styles.typeRow}>
              <TouchableOpacity
                style={styles.typeItem}
                onPress={() => setType("percent")}
              >
                <Ionicons
                  name={
                    type === "percent" ? "radio-button-on" : "radio-button-off"
                  }
                  size={20}
                  color="#2563EB"
                />
                <Text>Persen (%)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.typeItem}
                onPress={() => setType("fixed")}
              >
                <Ionicons
                  name={
                    type === "fixed" ? "radio-button-on" : "radio-button-off"
                  }
                  size={20}
                  color="#2563EB"
                />
                <Text>Nominal (Rp)</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder={type === "percent" ? "Contoh: 10" : "Contoh: 5000"}
              keyboardType="number-pad"
              value={value}
              onChangeText={(v) => setValue(v.replace(/\D/g, ""))}
              style={styles.input}
            />

            <TouchableOpacity style={styles.primary} onPress={handleAdd}>
              <Text style={styles.primaryText}>Simpan</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.cancel}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  header: { marginBottom: 16 },

  title: { fontSize: 22, fontWeight: "700" },

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

  rowText: { fontSize: 14, fontWeight: "500" },

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

  empty: {
    textAlign: "center",
    marginVertical: 20,
    color: "#94A3B8",
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

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },

  modal: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  typeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  typeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  primary: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 14,
    marginTop: 8,
  },

  primaryText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
  },

  cancel: {
    textAlign: "center",
    color: "#64748B",
    marginTop: 12,
  },
});
