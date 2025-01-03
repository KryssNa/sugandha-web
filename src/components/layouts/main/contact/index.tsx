import ContactSection from "@/components/sections/contact/contactSection";
import { DynamicBreadcrumb } from "@/components/shared/breadcrumb/dynamicBreadcrumb";

export const ContactPage = () => {
    return (
        <>
            <DynamicBreadcrumb />
            <ContactSection />
        </>
    );
}