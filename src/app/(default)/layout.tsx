"use client"
import Footer from "@/components/layouts/footers";
import Header from "@/components/layouts/headers";
import AuthProvider from "@/providers/authProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCurrentUser } from "@/store/slices/authSlice";
import { fetchCart } from "@/store/slices/cartSlice";
import { fetchCSRFToken } from "@/utils/csrf/CSRFToken";
import Preloader from "@/utils/helpers/Preloader";
import ScrollToTop from "@/utils/helpers/ScrollToTop";
import { useEffect } from "react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated]);
  useEffect(() => {
    fetchCSRFToken();
  }, []);
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
