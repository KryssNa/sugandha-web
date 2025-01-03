import { RegisterPage } from "@/components/sections/auth/register/registerSection";
import { DynamicBreadcrumb } from "@/components/shared/breadcrumb/dynamicBreadcrumb";

export const Register = () => {
  return (
    <>
      <DynamicBreadcrumb />
      <RegisterPage />
    </>
  );
};
