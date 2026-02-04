import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Switch,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

/* ================= FIREBASE ================= */
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/firebase";

/* ================= TYPES ================= */

type PaymentMethod = {
  id: string;
  name: string;
  isDefault: boolean;
  active: boolean;
};

/* ================= PAGE ================= */

export default function MetodePembayaran() {
  const router = useRouter();
  const storeId = "mie-bangladesh";

  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null,
  );

  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [isDefault, setIsDefault] = useState(false);

  /* ================= LOAD REALTIME ================= */
  useEffect(() => {
    const q = query(
      collection(db, "stores", storeId, "payment_methods"),
      orderBy("createdAt", "asc"),
    );

    const unsub = onSnapshot(q, (snap) => {
      setMethods(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })),
      );
    });

    return () => unsub();
  }, []);

  /* ================= RESET FORM ================= */
  function resetForm() {
    setName("");
    setActive(true);
    setIsDefault(false);
    setEditingMethod(null);
    setShowModal(false);
  }

  /* ================= OPEN EDIT ================= */
  function openEdit(item: PaymentMethod) {
    setEditingMethod(item);
    setName(item.name);
    setActive(item.active);
    setIsDefault(item.isDefault);
    setShowModal(true);
  }

  /* ================= SAVE (ADD / UPDATE) ================= */
  async function handleSave() {
    if (!name.trim()) {
      Alert.alert("Validasi", "Nama metode wajib diisi");
      return;
    }

    try {
      // pastikan cuma 1 default
      if (isDefault) {
        await Promise.all(
          methods.map((m) =>
            updateDoc(doc(db, "stores", storeId, "payment_methods", m.id), {
              isDefault: false,
            }),
          ),
        );
      }

      if (editingMethod) {
        // UPDATE
        await updateDoc(
          doc(db, "stores", storeId, "payment_methods", editingMethod.id),
          { name, active, isDefault },
        );
      } else {
        // ADD
        await addDoc(collection(db, "stores", storeId, "payment_methods"), {
          name,
          active,
          isDefault,
          createdAt: serverTimestamp(),
          createdBy: auth.currentUser?.uid || null,
        });
      }

      resetForm();
    } catch {
      Alert.alert("Error", "Gagal menyimpan metode");
    }
  }

  /* ================= DELETE ================= */
  function handleDelete(item: PaymentMethod) {
    Alert.alert("Hapus Metode", `Yakin ingin menghapus "${item.name}"?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(
            doc(db, "stores", storeId, "payment_methods", item.id),
          );
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Metode Pembayaran</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* LIST */}
      <FlatList
        data={methods}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => openEdit(item)}
            onLongPress={() => handleDelete(item)}
          >
            <View>
              <Text style={styles.name}>{item.name}</Text>
              {item.isDefault && <Text style={styles.default}>Default</Text>}
            </View>

            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      />

      {/* BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.addText}>Tambah Metode Pembayaran</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal visible={showModal} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={resetForm}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modal}>
          <View style={styles.handle} />
          <Text style={styles.modalTitle}>
            {editingMethod ? "Edit Metode" : "Tambah Metode Pembayaran"}
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Nama"
            style={styles.input}
          />

          <View style={styles.switchRow}>
            <Text>Aktifkan</Text>
            <Switch
              value={active}
              onValueChange={(v) => {
                setActive(v);
                if (!v) setIsDefault(false);
              }}
            />
          </View>

          <View style={styles.switchRow}>
            <Text>Default</Text>
            <Switch
              value={isDefault}
              onValueChange={setIsDefault}
              disabled={!active}
            />
          </View>

          <TouchableOpacity style={styles.submit} onPress={handleSave}>
            <Text style={styles.submitText}>
              {editingMethod ? "Simpan Perubahan" : "Tambah"}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  },

  /* LIST CARD */
  card: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
  },

  default: {
    fontSize: 12,
    marginTop: 4,
    color: "#6B7280",
  },

  toggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  toggleText: {
    fontSize: 13,
    color: "#6B7280",
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },

  radioActive: {
    borderColor: "#16A34A",
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#16A34A",
  },

  /* FOOTER */
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "#F1F5F9",
  },

  addButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  addText: {
    color: "white",
    fontWeight: "700",
  },

  /* MODAL */
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  modal: {
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 12,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    marginBottom: 20,
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },

  switchLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  switchText: {
    fontSize: 14,
    fontWeight: "500",
  },

  submit: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },

  submitText: {
    color: "white",
    fontWeight: "700",
  },
});
