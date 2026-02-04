import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Modal,
  TextInput, // ⬅️ TAMBAH INI
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

import { db } from "@/firebase";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 56) / 2;

const ActionBtn = ({ icon, text, full }: any) => (
  <View
    style={{
      flex: full ? 1 : undefined,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 14,
      borderRadius: 14,
      backgroundColor: "#F1F5F9",
    }}
  >
    <Ionicons name={icon} size={18} color="#0F172A" />
    <Text style={{ marginLeft: 8, fontWeight: "600" }}>{text}</Text>
  </View>
);

const Row = ({ label, value, bold, green }: any) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 6,
    }}
  >
    <Text style={{ fontWeight: bold ? "700" : "400" }}>{label}</Text>
    <Text
      style={{
        fontWeight: bold ? "700" : "400",
        color: green ? "#16A34A" : "#000",
      }}
    >
      Rp {value.toLocaleString("id-ID")}
    </Text>
  </View>
);

/* ================= TYPES ================= */

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  categoryId?: string;
  categoryName?: string;
};

type CartItem = Product & {
  qty: number;
};

type Charge = {
  id: string;
  name: string;
  type: "percent" | "fixed";
  value: number;
  active?: boolean;
};

type Discount = {
  id: string;
  name: string;
  type: "percent" | "fixed";
  value: number;
  active?: boolean;
};

type PaymentMethod = {
  id: string;
  name: string;
  active: boolean;
  isDefault?: boolean;
};

/* ================= PAGE ================= */

export default function Penjualan() {
  const storeId = "mie-bangladesh";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [charges, setCharges] = useState<Charge[]>([]);

  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null,
  );

  const [showDiscountPicker, setShowDiscountPicker] = useState(false);

  const [activeCategory, setActiveCategory] = useState<string | "ALL">("ALL");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCharges, setSelectedCharges] = useState<Charge[]>([]);

  const [showCart, setShowCart] = useState(false);
  const [showChargePicker, setShowChargePicker] = useState(false);
  const [loading, setLoading] = useState(true);

  // STATE UNTUK MODAL PRODUK
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);

  // ===== TAMBAHAN UNTUK PEMBAYARAN =====
  const [customerName, setCustomerName] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(
    null,
  );
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);
  const [paidAmount, setPaidAmount] = useState("");

  // ===== STATE STRUK =====
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptSetting, setReceiptSetting] = useState<any>(null);

  /* ================= LOAD DATA ================= */

  async function loadReceiptSetting() {
    try {
      const ref = doc(db, "stores", storeId, "settings", "receipt");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setReceiptSetting(snap.data());
      }
    } catch (e) {
      console.log("LOAD RECEIPT ERROR:", e);
    }
  }

  async function loadData() {
    try {
      const [prodSnap, catSnap, chargeSnap, discountSnap, paymentSnap] =
        await Promise.all([
          getDocs(collection(db, "stores", storeId, "products")),
          getDocs(collection(db, "stores", storeId, "categories")),
          getDocs(collection(db, "stores", storeId, "charges")),
          getDocs(collection(db, "stores", storeId, "discounts")),
          getDocs(collection(db, "stores", storeId, "payment_methods")),
        ]);

      setProducts(
        prodSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })),
      );

      setCategories(
        catSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })),
      );

      setCharges(
        chargeSnap.docs
          .map((d) => ({ id: d.id, ...(d.data() as any) }))
          .filter((c) => c.active === true),
      );
      setDiscounts(
        discountSnap.docs
          .map((d) => ({ id: d.id, ...(d.data() as any) }))
          .filter((d) => d.active === true),
      );
      const methods = paymentSnap.docs
        .map((d) => ({ id: d.id, ...(d.data() as any) }))
        .filter((m) => m.active === true);

      setPaymentMethods(methods);

      // auto pilih default
      const def = methods.find((m) => m.isDefault);
      if (def) setSelectedPayment(def);
    } catch (e) {
      console.log("LOAD ERROR:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    loadReceiptSetting();
  }, []);

  /* ================= FILTER ================= */

  const filteredProducts =
    activeCategory === "ALL"
      ? products
      : products.filter((p) => p.categoryId === activeCategory);

  function formatGrid(data: Product[]) {
    if (data.length % 2 === 1) {
      return [...data, { id: "__empty__", empty: true } as any];
    }
    return data;
  }

  /* ================= CART ================= */

  function addToCart(product: Product) {
    setCart((prev) => {
      const exist = prev.find((p) => p.id === product.id);
      if (exist) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p,
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function subtotal() {
    return cart.reduce((s, i) => s + i.qty * i.price, 0);
  }

  function chargeNominal(c: Charge) {
    if (c.type === "percent") {
      return Math.round((subtotal() * c.value) / 100);
    }
    return c.value;
  }

  function chargeTotal() {
    return selectedCharges.reduce((s, c) => s + chargeNominal(c), 0);
  }

  function discountNominal() {
    if (!selectedDiscount) return 0;

    if (selectedDiscount.type === "percent") {
      return Math.round((subtotal() * selectedDiscount.value) / 100);
    }

    return selectedDiscount.value;
  }

  function grandTotal() {
    return subtotal() + chargeTotal() - discountNominal();
  }

  function changeAmount() {
    const paid = Number(paidAmount || 0);
    return paid - grandTotal();
  }

  /* ================= UI ================= */

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      {/* HEADER */}
      <View
        style={{
          backgroundColor: "#0284C7",
          paddingTop: 64,
          paddingBottom: 20,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <Text style={{ color: "white", fontSize: 20, fontWeight: "700" }}>
          Penjualan
        </Text>
        <Text style={{ color: "#E0F2FE", fontSize: 14 }}>
          Pilih produk untuk ditambahkan
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0284C7"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={formatGrid(filteredProducts)}
          keyExtractor={(item: any) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 140 }}
          ListHeaderComponent={
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 12, gap: 8 }}
            >
              <TouchableOpacity
                onPress={() => setActiveCategory("ALL")}
                style={{
                  paddingHorizontal: 14,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor:
                    activeCategory === "ALL" ? "#E0F2FE" : "#E5E7EB",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: activeCategory === "ALL" ? "#0284C7" : "#64748B",
                  }}
                >
                  Semua
                </Text>
              </TouchableOpacity>

              {categories.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => setActiveCategory(c.id)}
                  style={{
                    paddingHorizontal: 14,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor:
                      activeCategory === c.id ? "#E0F2FE" : "#E5E7EB",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: activeCategory === c.id ? "#0284C7" : "#64748B",
                    }}
                  >
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          }
          renderItem={({ item }: any) => {
            if (item.empty) return <View style={{ width: CARD_WIDTH }} />;

            return (
              <View style={{ width: CARD_WIDTH }}>
                {/* ⬆️ INI KUNCINYA */}

                <TouchableOpacity
                  onPress={() => {
                    setSelectedProduct(item);
                    setQty(1);
                    setShowProductModal(true);
                  }}
                  style={{
                    backgroundColor: "white",
                    borderRadius: 16,
                    overflow: "hidden",
                    elevation: 3,
                  }}
                >
                  <Image
                    source={{
                      uri:
                        item.image ||
                        "https://dummyimage.com/300x200/e5e7eb/64748b&text=No+Image",
                    }}
                    style={{ width: "100%", height: 120 }}
                  />

                  <View style={{ padding: 12 }}>
                    <Text numberOfLines={2} style={{ fontWeight: "600" }}>
                      {item.name}
                    </Text>
                    <Text style={{ color: "#0284C7", fontWeight: "700" }}>
                      Rp {item.price.toLocaleString("id-ID")}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#64748B" }}>
                      {item.categoryName}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      {/* BOTTOM BAR */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
          padding: 16,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          elevation: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => setShowCart(true)}
          style={{
            backgroundColor: "#0284C7",
            paddingVertical: 16,
            borderRadius: 14,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="cart-outline" size={20} color="white" />
          <Text style={{ color: "white", marginLeft: 8, fontWeight: "600" }}>
            Lihat Keranjang ({cart.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= CART MODAL ================= */}
      <Modal visible={showCart} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: "85%",
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            >
              {/* ISI CART */}
              {/* HEADER */}
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Ringkasan
              </Text>

              {/* NAMA PELANGGAN */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{ fontSize: 14, color: "#64748B", marginBottom: 6 }}
                >
                  Nama pelanggan
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#F1F5F9",
                    borderRadius: 14,
                    padding: 14,
                  }}
                >
                  <Ionicons name="person-outline" size={20} color="#64748B" />

                  <TextInput
                    placeholder="Nama pelanggan"
                    value={customerName}
                    onChangeText={setCustomerName}
                    style={{
                      marginLeft: 10,
                      fontSize: 16,
                      flex: 1,
                    }}
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
              {/* PAJAK / BIAYA / ONGKOS (DROPDOWN) */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#64748B",
                    marginBottom: 6,
                  }}
                >
                  Pajak / Biaya / Ongkos
                </Text>

                <TouchableOpacity
                  onPress={() => setShowChargePicker(true)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F1F5F9",
                    borderRadius: 14,
                    padding: 14,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#0F172A" }}>
                    {selectedCharges.length > 0
                      ? `${selectedCharges.length} dipilih`
                      : "Pilih pajak / biaya"}
                  </Text>

                  <Ionicons name="chevron-down" size={18} color="#64748B" />
                </TouchableOpacity>

                {/* DETAIL PAJAK TERPILIH */}
                {selectedCharges.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    {selectedCharges.map((c) => (
                      <View
                        key={c.id}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: 4,
                        }}
                      >
                        <Text style={{ fontSize: 13, color: "#475569" }}>
                          • {c.name}
                        </Text>

                        <Text style={{ fontSize: 13, color: "#475569" }}>
                          {c.type === "percent"
                            ? `${c.value}%`
                            : `Rp ${c.value.toLocaleString("id-ID")}`}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              {/* DISKON / POTONGAN */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#64748B",
                    marginBottom: 6,
                  }}
                >
                  Diskon / Potongan
                </Text>

                <TouchableOpacity
                  onPress={() => setShowDiscountPicker(true)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#F1F5F9",
                    borderRadius: 14,
                    padding: 14,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#0F172A" }}>
                    {selectedDiscount ? selectedDiscount.name : "Pilih diskon"}
                  </Text>

                  <Ionicons name="chevron-down" size={18} color="#64748B" />
                </TouchableOpacity>

                {/* DETAIL DISKON */}
                {selectedDiscount && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 6,
                    }}
                  >
                    <Text style={{ fontSize: 13, color: "#475569" }}>
                      {selectedDiscount.type === "percent"
                        ? "Diskon Persentase"
                        : "Potongan Nominal"}
                    </Text>

                    <Text style={{ fontSize: 13, color: "#16A34A" }}>
                      {selectedDiscount.type === "percent"
                        ? `${selectedDiscount.value}%`
                        : `Rp ${selectedDiscount.value.toLocaleString("id-ID")}`}
                    </Text>
                  </View>
                )}
              </View>

              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 20,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "700", marginBottom: 12 }}
                >
                  Items
                </Text>

                {cart.map((item) => (
                  <View key={item.id} style={{ marginBottom: 12 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View>
                        <Text style={{ fontWeight: "600" }}>{item.name}</Text>
                        <Text style={{ fontSize: 12, color: "#64748B" }}>
                          {item.qty} x Rp {item.price.toLocaleString("id-ID")}
                        </Text>
                      </View>

                      <Text style={{ fontWeight: "600" }}>
                        Rp {(item.qty * item.price).toLocaleString("id-ID")}
                      </Text>
                    </View>

                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#E5E7EB",
                        marginTop: 10,
                      }}
                    />
                  </View>
                ))}

                {/* TOTAL */}
                <View style={{ marginTop: 8 }}>
                  <Row label="Subtotal" value={subtotal()} />
                  <Row label="Diskon" value={-discountNominal()} green />
                  <Row label="PPN" value={chargeTotal()} />
                  <Row label="Total" value={grandTotal()} bold />
                </View>
                {/* ================= METODE PEMBAYARAN ================= */}
                <View style={{ marginTop: 20 }}>
                  <Text
                    style={{ fontSize: 14, color: "#64748B", marginBottom: 6 }}
                  >
                    Metode Pembayaran
                  </Text>

                  <TouchableOpacity
                    onPress={() => setShowPaymentPicker(true)}
                    style={{
                      backgroundColor: "#F1F5F9",
                      borderRadius: 14,
                      padding: 14,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>
                      {selectedPayment
                        ? selectedPayment.name
                        : "Pilih metode pembayaran"}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#64748B" />
                  </TouchableOpacity>
                </View>

                {/* ================= UANG DIBAYAR ================= */}
                <View style={{ marginTop: 16 }}>
                  <Text
                    style={{ fontSize: 14, color: "#64748B", marginBottom: 6 }}
                  >
                    Uang Dibayar
                  </Text>

                  <View
                    style={{
                      backgroundColor: "#F1F5F9",
                      borderRadius: 14,
                      padding: 14,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontWeight: "600", marginRight: 6 }}>
                      Rp
                    </Text>
                    <TextInput
                      value={paidAmount}
                      onChangeText={(v) => setPaidAmount(v.replace(/\D/g, ""))}
                      keyboardType="number-pad"
                      placeholder="0"
                      style={{ flex: 1, fontSize: 16 }}
                    />
                  </View>
                </View>

                {/* ================= KEMBALIAN ================= */}
                {paidAmount !== "" && (
                  <View style={{ marginTop: 12 }}>
                    <Row
                      label="Kembalian"
                      value={changeAmount()}
                      green={changeAmount() >= 0}
                      bold
                    />
                  </View>
                )}
              </View>

              <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
                {/* TUTUP */}
                <TouchableOpacity
                  onPress={() => setShowCart(false)}
                  style={{
                    flex: 1,
                    backgroundColor: "#E5E7EB",
                    padding: 14,
                    borderRadius: 14,
                  }}
                >
                  <Text style={{ textAlign: "center", fontWeight: "700" }}>
                    Tutup
                  </Text>
                </TouchableOpacity>

                {/* BAYAR */}
                <TouchableOpacity
                  onPress={() => {
                    setShowCart(false);
                    setShowReceipt(true);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: "#16A34A",
                    padding: 14,
                    borderRadius: 14,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontWeight: "700",
                    }}
                  >
                    Bayar
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ================= PRODUCT MODAL ================= */}
      <Modal visible={showProductModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#F8FAFC",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
            }}
          >
            {selectedProduct && (
              <>
                {/* HEADER */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{
                      uri:
                        selectedProduct.image ??
                        "https://dummyimage.com/100x100/e5e7eb/64748b&text=No+Image",
                    }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 12,
                      marginRight: 12,
                    }}
                  />

                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "700", fontSize: 16 }}>
                      {selectedProduct.name}
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: "700" }}>
                      Rp {selectedProduct.price.toLocaleString("id-ID")}
                    </Text>
                  </View>
                </View>

                {/* JUMLAH */}
                <Text style={{ marginTop: 24, fontWeight: "600" }}>Jumlah</Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 8,
                    backgroundColor: "white",
                    borderRadius: 14,
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                    height: 56,
                  }}
                >
                  <TouchableOpacity onPress={() => qty > 1 && setQty(qty - 1)}>
                    <Text style={{ fontSize: 22 }}>−</Text>
                  </TouchableOpacity>

                  <Text style={{ fontSize: 18, fontWeight: "700" }}>{qty}</Text>

                  <TouchableOpacity onPress={() => setQty(qty + 1)}>
                    <Text style={{ fontSize: 22 }}>+</Text>
                  </TouchableOpacity>
                </View>

                {/* TOTAL */}
                <View style={{ marginTop: 20 }}>
                  <Text style={{ fontWeight: "600" }}>Total</Text>
                  <Text style={{ fontSize: 24, fontWeight: "800" }}>
                    Rp {(qty * selectedProduct.price).toLocaleString("id-ID")}
                  </Text>
                </View>

                {/* SIMPAN */}
                <TouchableOpacity
                  onPress={() => {
                    for (let i = 0; i < qty; i++) {
                      addToCart(selectedProduct);
                    }
                    setShowProductModal(false);
                  }}
                  style={{
                    backgroundColor: "#2563EB",
                    paddingVertical: 16,
                    borderRadius: 16,
                    marginTop: 24,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontWeight: "700",
                      fontSize: 16,
                    }}
                  >
                    Simpan
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ================= CHARGE PICKER ================= */}

      {/* ================= CHARGE PICKER ================= */}
      <Modal visible={showChargePicker} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <Text style={{ fontWeight: "700", marginBottom: 12 }}>
              Pajak / Biaya / Ongkos
            </Text>

            {charges.map((c) => {
              const active = selectedCharges.some((x) => x.id === c.id);

              return (
                <TouchableOpacity
                  key={c.id}
                  onPress={() =>
                    setSelectedCharges((prev) =>
                      active ? prev.filter((x) => x.id !== c.id) : [...prev, c],
                    )
                  }
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 12,
                  }}
                >
                  <View>
                    <Text style={{ fontWeight: "600" }}>{c.name}</Text>
                    <Text style={{ fontSize: 12, color: "#64748B" }}>
                      {c.type === "percent"
                        ? `${c.value}%`
                        : `Rp ${c.value.toLocaleString("id-ID")}`}
                    </Text>
                  </View>

                  <Ionicons
                    name={active ? "checkbox" : "square-outline"}
                    size={20}
                    color="#2563EB"
                  />
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity onPress={() => setShowChargePicker(false)}>
              <Text
                style={{
                  textAlign: "center",
                  color: "#2563EB",
                  marginTop: 12,
                  fontWeight: "600",
                }}
              >
                Selesai
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= DISCOUNT PICKER ================= */}
      <Modal visible={showDiscountPicker} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <Text style={{ fontWeight: "700", marginBottom: 12 }}>
              Pilih Diskon
            </Text>

            {discounts.map((d) => (
              <TouchableOpacity
                key={d.id}
                onPress={() => {
                  setSelectedDiscount(d);
                  setShowDiscountPicker(false);
                }}
                style={{
                  paddingVertical: 12,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text style={{ fontWeight: "600" }}>{d.name}</Text>
                  <Text style={{ fontSize: 12, color: "#64748B" }}>
                    {d.type === "percent"
                      ? `Diskon ${d.value}%`
                      : `Potongan Rp ${d.value.toLocaleString("id-ID")}`}
                  </Text>
                </View>

                {selectedDiscount?.id === d.id && (
                  <Ionicons name="checkmark" size={18} color="#16A34A" />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={() => setShowDiscountPicker(false)}>
              <Text
                style={{
                  textAlign: "center",
                  color: "#2563EB",
                  marginTop: 12,
                  fontWeight: "600",
                }}
              >
                Batal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* ================= PAYMENT PICKER ================= */}
      <Modal visible={showPaymentPicker} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <Text style={{ fontWeight: "700", marginBottom: 12 }}>
              Pilih Metode Pembayaran
            </Text>

            {paymentMethods.map((m) => (
              <TouchableOpacity
                key={m.id}
                onPress={() => {
                  setSelectedPayment(m);
                  setShowPaymentPicker(false);
                }}
                style={{
                  paddingVertical: 12,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontWeight: "600" }}>{m.name}</Text>

                {selectedPayment?.id === m.id && (
                  <Ionicons name="checkmark" size={18} color="#16A34A" />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={() => setShowPaymentPicker(false)}>
              <Text
                style={{
                  textAlign: "center",
                  color: "#2563EB",
                  marginTop: 12,
                  fontWeight: "600",
                }}
              >
                Batal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* ================= STRUK MODAL ================= */}
      <Modal visible={showReceipt} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              margin: 24,
              borderRadius: 16,
              padding: 16,
            }}
          >
            {receiptSetting?.showLogo && (
              <Text
                style={{ fontSize: 16, fontWeight: "700", textAlign: "center" }}
              >
                {receiptSetting.brandTitle}
              </Text>
            )}

            {receiptSetting?.showTanggal && (
              <Text
                style={{ fontSize: 12, textAlign: "center", marginBottom: 8 }}
              >
                {new Date().toLocaleString("id-ID")}
              </Text>
            )}

            {receiptSetting?.showKasir && (
              <Text style={{ fontSize: 12, textAlign: "center" }}>
                Kasir: Admin
              </Text>
            )}

            <View
              style={{
                borderBottomWidth: 1,
                borderStyle: "dashed",
                marginVertical: 8,
              }}
            />

            {cart.map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>
                  {item.qty} x {item.name}
                </Text>
                <Text>
                  Rp {(item.qty * item.price).toLocaleString("id-ID")}
                </Text>
              </View>
            ))}

            <View
              style={{
                borderBottomWidth: 1,
                borderStyle: "dashed",
                marginVertical: 8,
              }}
            />

            <Row label="Subtotal" value={subtotal()} />

            {receiptSetting?.showDiskon && (
              <Row label="Diskon" value={-discountNominal()} />
            )}

            {receiptSetting?.showPajak && (
              <Row label="Pajak" value={chargeTotal()} />
            )}

            <Row label="Total" value={grandTotal()} bold />

            {receiptSetting?.showCatatan && (
              <Text style={{ textAlign: "center", marginTop: 12 }}>
                Terima kasih 🙏
              </Text>
            )}

            <TouchableOpacity
              onPress={() => setShowReceipt(false)}
              style={{ marginTop: 16 }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#2563EB",
                  fontWeight: "600",
                }}
              >
                Tutup
              </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
              {/* PRINT */}
              <TouchableOpacity
                onPress={() => console.log("PRINT STRUK")}
                style={{
                  flex: 1,
                  backgroundColor: "#0F172A",
                  padding: 12,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "700",
                  }}
                >
                  Print
                </Text>
              </TouchableOpacity>

              {/* WHATSAPP */}
              <TouchableOpacity
                onPress={() => console.log("KIRIM WHATSAPP")}
                style={{
                  flex: 1,
                  backgroundColor: "#16A34A",
                  padding: 12,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "700",
                  }}
                >
                  WhatsApp
                </Text>
              </TouchableOpacity>

              {/* TUTUP */}
              <TouchableOpacity
                onPress={() => setShowReceipt(false)}
                style={{
                  flex: 1,
                  backgroundColor: "#E5E7EB",
                  padding: 12,
                  borderRadius: 12,
                }}
              >
                <Text style={{ textAlign: "center", fontWeight: "700" }}>
                  Tutup
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
