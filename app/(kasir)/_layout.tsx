import { Stack } from "expo-router";

export default function KasirLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="penjualan" />
      <Stack.Screen name="produk" />
      <Stack.Screen name="grafik" />
      <Stack.Screen name="riwayat" />
      <Stack.Screen name="pembayaran" />
    </Stack>
  );
}
