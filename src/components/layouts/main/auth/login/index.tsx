import { LoginPage } from "@/components/sections/auth/login/loginSection";
import { DynamicBreadcrumb } from "@/components/shared/breadcrumb/dynamicBreadcrumb";

export const Login = () => {
  return (
    <>
    <DynamicBreadcrumb  />
      <LoginPage />
    </>
  );
};
