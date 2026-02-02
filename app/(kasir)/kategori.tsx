import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

/* ================= TYPES ================= */

type Category = {
  id: string;
  name: string;
  icon: string;
  total: number;
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

  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "tes",
      icon: "car-outline",
      total: 0,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState<string>("square-outline");

  function handleAdd() {
    if (!name.trim()) return;

    setCategories((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        icon,
        total: 0,
      },
    ]);

    setName("");
    setIcon("square-outline");
    setShowModal(false);
  }

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Kategori</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* ================= LIST ================= */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.left}>
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon as any} size={18} color="#2563EB" />
              </View>

              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.count}>{item.total} Items</Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </View>
        )}
      />

      {/* ================= BUTTON ================= */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.85}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.addText}>Tambah Kategori</Text>
        </TouchableOpacity>
      </View>

      {/* ================= MODAL TAMBAH ================= */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.handle} />

            <Text style={styles.modalTitle}>Tambah Kategori</Text>

            <Text style={styles.label}>Nama</Text>

            <View style={styles.inputRow}>
              {/* ICON PICKER */}
              <TouchableOpacity
                style={styles.iconPicker}
                onPress={() => setShowIconPicker(true)}
              >
                <Ionicons name={icon as any} size={22} color="#2563EB" />
                <Ionicons name="chevron-down" size={16} color="#94A3B8" />
              </TouchableOpacity>

              {/* INPUT */}
              <TextInput
                placeholder="Nama"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
            </View>

            <TouchableOpacity
              style={styles.submit}
              activeOpacity={0.85}
              onPress={handleAdd}
            >
              <Text style={styles.submitText}>Tambah</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL ICON PICKER ================= */}
      <Modal visible={showIconPicker} transparent animationType="fade">
        <View style={styles.overlayCenter}>
          <View style={styles.iconModal}>
            <Text style={styles.iconTitle}>Pilih Ikon</Text>

            <ScrollView contentContainerStyle={styles.iconGrid}>
              {ICONS.map((ic) => (
                <TouchableOpacity
                  key={ic}
                  style={[styles.iconItem, icon === ic && styles.iconSelected]}
                  onPress={() => {
                    setIcon(ic);
                    setShowIconPicker(false);
                  }}
                >
                  <Ionicons name={ic as any} size={22} color="#2563EB" />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setShowIconPicker(false)}
            >
              <Ionicons name="close" size={22} color="#DC2626" />
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
    backgroundColor: "#F1F5F9",
  },

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

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
  },

  count: {
    fontSize: 12,
    color: "#6B7280",
  },

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

  inputRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },

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

  submitText: {
    color: "white",
    fontWeight: "700",
  },

  /* ICON PICKER */
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

  iconTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  iconItem: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  iconSelected: {
    borderWidth: 2,
    borderColor: "#2563EB",
  },

  closeIcon: {
    position: "absolute",
    top: 12,
    right: 12,
  },
});
