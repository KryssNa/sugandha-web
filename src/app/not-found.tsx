import Footer from "@/components/layouts/footers";
import Header from "@/components/layouts/headers";
import { NotFound } from "@/components/sections/error/errorSection";
import { NotFoundSection } from "@/components/sections/error/notFoundSection";
import { DynamicBreadcrumb } from "@/components/shared/breadcrumb/dynamicBreadcrumb";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <>
    {/* <Header /> */}
    {/* <DynamicBreadcrumb /> */}
    {/* <NotFoundSection /> */}
    <NotFound />
    {/* <Footer /> */}
    </>
  
  )
}
