import "./globals.css";

export const metadata = {
  title: "Buku Tamu — Kejaksaan Negeri Banyuasin",
  description: "Pencatatan kunjungan tamu secara digital",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
