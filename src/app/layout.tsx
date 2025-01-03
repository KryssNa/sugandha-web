import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sugandha Express Yourself through Fragrance",
  description:
    "Discover your signature scent at Sugandha. From luxurious perfumes to exotic fragrances, find the perfect aroma that tells your unique story. Premium quality scents at affordable prices. Shop now and express your personality through fragrance.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'
    suppressHydrationWarning={true}
    >
      <body 
      className='flex flex-col min-h-screen bg-gray-100 text-gray-800 font-sans'
      >
        {children}
      </body>
    </html>
  );
}
