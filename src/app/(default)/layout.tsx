"use client"
import Footer from "@/components/layouts/footers";
import Header from "@/components/layouts/headers";
import AuthProvider from "@/providers/authProvider";
import { useAppDispatch } from "@/store/hooks";
import { fetchCart } from "@/store/slices/cartSlice";
import Preloader from "@/utils/helpers/Preloader";
import ScrollToTop from "@/utils/helpers/ScrollToTop";
import { useEffect } from "react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);
  return (
    <AuthProvider>
      {/* preloader */}
      <Preloader />
      {/* header */}
      <Header />
      {children}

      {/* scroll to top */}
      <ScrollToTop />
      {/* footer */}
      <Footer />
    </AuthProvider>
  );
}
