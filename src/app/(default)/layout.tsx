"use client"
import Footer from "@/components/layouts/footers";
import Header from "@/components/layouts/headers";
import AuthProvider from "@/providers/authProvider";
import { hydrate } from "@/store/slices/cartSlice";
import Preloader from "@/utils/helpers/Preloader";
import ScrollToTop from "@/utils/helpers/ScrollToTop";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize cart from localStorage when app loads
    dispatch(hydrate());
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
