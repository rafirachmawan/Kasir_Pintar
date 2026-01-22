export type Product = {
  id: string;
  nama: string;
  harga: number;
};

export const products: Product[] = [
  { id: "1", nama: "Kopi", harga: 5000 },
  { id: "2", nama: "Teh", harga: 3000 },
  { id: "3", nama: "Roti", harga: 7000 },
  { id: "4", nama: "Air Mineral", harga: 4000 },
];
