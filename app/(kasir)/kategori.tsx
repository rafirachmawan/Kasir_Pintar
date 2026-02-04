import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
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
  serverTimestamp,
  doc,
  getDoc,
  deleteDoc,
  updateDoc, // ➕ TAMBAHAN
} from "firebase/firestore";
import { auth, db } from "../../firebase";

/* ================= TYPES ================= */

type Category = {
  id: string;
  name: string;
  icon: string;
};

/* ================= ICON LIST ================= */

const ICONS = [
  "car-outline",
  "cube-outline",
  "fast-food-outline",
  "shirt-outline",
  "pricetag-outline",
  "cart-outline",
  "home-outline",
  "cafe-outline",
  "construct-outline",
  "medkit-outline",
  "gift-outline",
  "basket-outline",
];

/* ================= PAGE ================= */

export default function Kategori() {
  const router = useRouter();

  const [storeId, setStoreId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("fast-food-outline");
  const [loading, setLoading] = useState(false);

  /* ================= LOAD STORE ID ================= */
  useEffect(() => {
    const loadStore = async () => {
      if (!auth.currentUser) return;

      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));

      if (snap.exists()) {
        setStoreId(snap.data().storeId);
      } else {
        Alert.alert("Error", "Data user tidak ditemukan");
      }
    };

    loadStore();
  }, []);

  /* ================= LOAD CATEGORY REALTIME ================= */
  useEffect(() => {
    if (!storeId) return;

    const q = query(
      collection(db, "stores", storeId, "categories"),
      orderBy("createdAt", "desc"),
    );

    const unsub = onSnapshot(q, (snap) => {
      const data: Category[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Category, "id">),
      }));

      setCategories(data);
    });

    return () => unsub();
  }, [storeId]);

  /* ================= RESET FORM ================= */
  function resetForm() {
    setEditingCategory(null);
    setName("");
    setIcon("fast-food-outline");
    setShowIconPicker(false);
    setShowModal(false);
  }

  /* ================= SELECT (EDIT) ================= */
  function handleSelectCategory(cat: Category) {
    setEditingCategory(cat);
    setName(cat.name);
    setIcon(cat.icon);
    setShowModal(true);
  }

  /* ================= ADD ================= */
  async function handleAdd() {
    if (!name.trim() || !storeId) return;

    try {
      setLoading(true);

      await addDoc(collection(db, "stores", storeId, "categories"), {
        name,
        icon,
        createdAt: serverTimestamp(),
      });

      resetForm();
    } catch {
      Alert.alert("Error", "Gagal menyimpan kategori");
    } finally {
      setLoading(false);
    }
  }

  /* ================= UPDATE ================= */
  async function handleUpdate() {
    if (!editingCategory || !storeId) return;

    try {
      setLoading(true);

      await updateDoc(
        doc(db, "stores", storeId, "categories", editingCategory.id),
        {
          name,
          icon,
          updatedAt: serverTimestamp(),
        },
      );

      resetForm();
    } catch {
      Alert.alert("Error", "Gagal update kategori");
    } finally {
      setLoading(false);
    }
  }

  /* ================= DELETE ================= */
  function handleDeleteCategory(cat: Category) {
    if (!storeId) return;

    Alert.alert(
      "Hapus Kategori",
      `Yakin ingin menghapus kategori "${cat.name}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            await deleteDoc(doc(db, "stores", storeId, "categories", cat.id));
            resetForm();
          },
        },
      ],
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kategori</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* LIST */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleSelectCategory(item)}
          >
            <View style={styles.left}>
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon as any} size={18} color="#2563EB" />
              </View>
              <Text style={styles.name}>{item.name}</Text>
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
          <Text style={styles.addText}>Tambah Kategori</Text>
        </TouchableOpacity>
      </View>

      {/* ================= MODAL ADD / EDIT ================= */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={resetForm}
      >
        <TouchableWithoutFeedback onPress={resetForm}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modal}>
          <View style={styles.handle} />

          <Text style={styles.modalTitle}>
            {editingCategory ? "Edit Kategori" : "Tambah Kategori"}
          </Text>

          <View style={styles.inputRow}>
            <TouchableOpacity
              style={styles.iconPicker}
              onPress={() => setShowIconPicker(true)}
            >
              <Ionicons name={icon as any} size={22} color="#2563EB" />
              <Ionicons name="chevron-down" size={16} color="#94A3B8" />
            </TouchableOpacity>

            <TextInput
              placeholder="Nama"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
          </View>

          <TouchableOpacity
            style={styles.submit}
            onPress={editingCategory ? handleUpdate : handleAdd}
            disabled={loading}
          >
            <Text style={styles.submitText}>
              {loading ? "Menyimpan..." : editingCategory ? "Update" : "Tambah"}
            </Text>
          </TouchableOpacity>

          {editingCategory && (
            <TouchableOpacity
              onPress={() => handleDeleteCategory(editingCategory)}
            >
              <Text
                style={{
                  color: "#DC2626",
                  textAlign: "center",
                  marginTop: 14,
                  fontWeight: "600",
                }}
              >
                Hapus Kategori
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>

      {/* ================= ICON PICKER ================= */}
      <Modal
        visible={showIconPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowIconPicker(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowIconPicker(false)}>
          <View style={styles.overlayCenter} />
        </TouchableWithoutFeedback>

        <View style={styles.iconModal}>
          <ScrollView contentContainerStyle={styles.iconGrid}>
            {ICONS.map((ic) => (
              <TouchableOpacity
                key={ic}
                style={styles.iconItem}
                onPress={() => {
                  setIcon(ic);
                  setShowIconPicker(false);
                }}
              >
                <Ionicons name={ic as any} size={22} color="#2563EB" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F5F9" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "white",
  },

  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },

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

  left: { flexDirection: "row", alignItems: "center", gap: 12 },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  name: { fontSize: 14, fontWeight: "600" },

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

  addText: { color: "white", fontWeight: "700" },

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

  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16 },

  label: { fontSize: 14, fontWeight: "600", marginBottom: 8 },

  inputRow: { flexDirection: "row", gap: 12, marginBottom: 24 },

  iconPicker: {
    width: 56,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
    paddingHorizontal: 12,
  },

  submit: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  submitText: { color: "white", fontWeight: "700" },

  overlayCenter: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  iconModal: {
    width: "90%",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
  },

  iconTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },

  iconGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },

  iconItem: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  iconSelected: { borderWidth: 2, borderColor: "#2563EB" },
});
