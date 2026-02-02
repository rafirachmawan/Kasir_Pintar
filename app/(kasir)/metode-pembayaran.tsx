import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

/* ================= TYPES ================= */

type PaymentMethod = {
  id: string;
  name: string;
  isDefault?: boolean;
  active: boolean;
};

/* ================= PAGE ================= */

export default function MetodePembayaran() {
  const router = useRouter();

  const [methods, setMethods] = useState<PaymentMethod[]>([
    { id: "cash", name: "Cash", isDefault: true, active: true },
    { id: "bank", name: "Bank transfer", active: true },
    { id: "cc", name: "Credit card", active: true },
  ]);

  /* ===== modal state ===== */
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [isDefault, setIsDefault] = useState(false);

  /* ===== toggle active list ===== */
  const toggleActive = (id: string) => {
    setMethods((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item,
      ),
    );
  };

  /* ===== add method ===== */
  const handleAdd = () => {
    if (!name.trim()) return;

    setMethods((prev) => [
      ...prev.map((m) => (isDefault ? { ...m, isDefault: false } : m)),
      {
        id: Date.now().toString(),
        name,
        active,
        isDefault,
      },
    ]);

    setName("");
    setActive(true);
    setIsDefault(false);
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Metode Pembayaran</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* ================= LIST ================= */}
      <FlatList
        data={methods}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              {item.isDefault && <Text style={styles.default}>Default</Text>}
            </View>

            <TouchableOpacity
              style={styles.toggle}
              onPress={() => toggleActive(item.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.toggleText}>Aktifkan</Text>
              <View style={[styles.radio, item.active && styles.radioActive]}>
                {item.active && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* ================= BUTTON BAWAH ================= */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.85}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.addText}>Tambah Metode Pembayaran</Text>
        </TouchableOpacity>
      </View>

      {/* ================= MODAL TAMBAH ================= */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.handle} />

            <Text style={styles.modalTitle}>Tambah Metode Pembayaran</Text>

            {/* ===== Nama ===== */}
            <Text style={styles.label}>Nama</Text>
            <TextInput
              placeholder="Nama"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            {/* ===== Aktifkan ===== */}
            <View style={styles.switchRow}>
              <View style={styles.switchLeft}>
                <Ionicons
                  name="help-circle-outline"
                  size={18}
                  color="#9CA3AF"
                />
                <Text style={styles.switchText}>Aktifkan</Text>
              </View>
              <Switch
                value={active}
                onValueChange={(v) => {
                  setActive(v);
                  if (!v) setIsDefault(false);
                }}
              />
            </View>

            {/* ===== Default ===== */}
            <View style={styles.switchRow}>
              <View style={styles.switchLeft}>
                <Ionicons
                  name="help-circle-outline"
                  size={18}
                  color="#9CA3AF"
                />
                <Text style={styles.switchText}>Default</Text>
              </View>
              <Switch
                value={isDefault}
                onValueChange={setIsDefault}
                disabled={!active}
              />
            </View>

            {/* ===== Submit ===== */}
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
