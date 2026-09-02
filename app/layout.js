import "./globals.css";

export const metadata = {
  title: "Yulduzlar Osmoni",
  description: "Sinf uchun yulduzlar taxtasi — o'quvchilarni rag'batlantirish ilovasi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
