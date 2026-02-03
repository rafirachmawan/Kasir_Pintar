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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 56) / 2;

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

  /* ================= LOAD DATA ================= */

  async function loadData() {
    try {
      const [prodSnap, catSnap, chargeSnap, discountSnap] = await Promise.all([
        getDocs(collection(db, "stores", storeId, "products")),
        getDocs(collection(db, "stores", storeId, "categories")),
        getDocs(collection(db, "stores", storeId, "charges")),
        getDocs(collection(db, "stores", storeId, "discounts")),
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
    } catch (e) {
      console.log("LOAD ERROR:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
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
              <TouchableOpacity
                onPress={() => addToCart(item)}
                style={{
                  width: CARD_WIDTH,
                  backgroundColor: "white",
                  borderRadius: 16,
                  marginBottom: 16,
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
              padding: 16,
              maxHeight: "85%",
            }}
          >
            {/* DRAG BAR */}
            <View style={{ alignItems: "center", marginBottom: 12 }}>
              <View
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "#CBD5E1",
                }}
              />
              <Text style={{ fontSize: 18, fontWeight: "700", marginTop: 8 }}>
                Keranjang
              </Text>
            </View>

            {/* ITEMS */}
            <FlatList
              data={cart}
              keyExtractor={(i) => i.id}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: 1,
                    backgroundColor: "#E5E7EB",
                    marginVertical: 8,
                  }}
                />
              )}
              renderItem={({ item }) => (
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

                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontWeight: "600" }}>
                      Rp {(item.qty * item.price).toLocaleString("id-ID")}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setCart((p) => p.filter((x) => x.id !== item.id))
                      }
                    >
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color="#DC2626"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />

            {/* CHARGE DROPDOWN */}
            <TouchableOpacity
              onPress={() => setShowChargePicker(true)}
              style={{
                marginTop: 16,
                padding: 14,
                borderRadius: 12,
                backgroundColor: "#F1F5F9",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontWeight: "600" }}>Pajak / Biaya / Ongkos</Text>
              <Ionicons name="chevron-down" size={18} />
            </TouchableOpacity>

            {/* SELECTED CHARGES */}
            {selectedCharges.map((c) => (
              <View
                key={c.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 6,
                }}
              >
                <Text style={{ fontSize: 13 }}>
                  {c.name} {c.type === "percent" ? `(${c.value}%)` : ""}
                </Text>
                <Text style={{ fontSize: 13 }}>
                  Rp {chargeNominal(c).toLocaleString("id-ID")}
                </Text>
              </View>
            ))}

            {/* DISCOUNT */}
            <TouchableOpacity
              onPress={() => setShowDiscountPicker(true)}
              style={{
                marginTop: 12,
                padding: 14,
                borderRadius: 12,
                backgroundColor: "#ECFDF5",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontWeight: "600" }}>Diskon / Potongan</Text>
              <Text style={{ color: "#16A34A" }}>
                {selectedDiscount
                  ? selectedDiscount.type === "percent"
                    ? `-${selectedDiscount.value}%`
                    : `-Rp ${selectedDiscount.value.toLocaleString("id-ID")}`
                  : "Pilih"}
              </Text>
            </TouchableOpacity>

            {/* TOTAL */}
            <View style={{ marginTop: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>Subtotal</Text>
                <Text>Rp {subtotal().toLocaleString("id-ID")}</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>Biaya</Text>
                <Text>Rp {chargeTotal().toLocaleString("id-ID")}</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>Diskon</Text>
                <Text style={{ color: "#16A34A" }}>
                  -Rp {discountNominal().toLocaleString("id-ID")}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <Text style={{ fontWeight: "700", fontSize: 16 }}>Total</Text>
                <Text style={{ fontWeight: "700", fontSize: 16 }}>
                  Rp {grandTotal().toLocaleString("id-ID")}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setShowCart(false)}
              style={{
                backgroundColor: "#0284C7",
                padding: 14,
                borderRadius: 14,
                marginTop: 16,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "700",
                }}
              >
                Tutup
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
            style={{ backgroundColor: "white", borderRadius: 16, padding: 16 }}
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
            style={{ backgroundColor: "white", borderRadius: 16, padding: 16 }}
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
                style={{ paddingVertical: 12 }}
              >
                <Text style={{ fontWeight: "600" }}>{d.name}</Text>
                <Text style={{ fontSize: 12, color: "#64748B" }}>
                  {d.type === "percent"
                    ? `${d.value}%`
                    : `Rp ${d.value.toLocaleString("id-ID")}`}
                </Text>
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
    </View>
  );
}
