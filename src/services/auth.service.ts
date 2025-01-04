import { api } from "@/lib/axios";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  firstName: string;
  lastName: string;
}

export const authService = {
  async register(data: RegisterData) {
    try {
      const response = await api.post("/auth/register", data);
      this.setTokens(response.data?.tokens || response.data?.data?.tokens);
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  async login(data: LoginData) {
    try {
      const response = await api.post("/auth/login", data);

      // Ensure tokens exist before setting
      const tokens = response.data?.data?.tokens || response.data?.tokens;
      if (!tokens) {
        throw new Error("No authentication tokens found in response");
      }

      this.setTokens(tokens);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        message: (error as any).response?.data?.message || (error as any).message,
      };
    }
  },

  async logout() {
    try {
      // Optional: Call backend logout endpoint if needed
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },

  setTokens(tokens: { accessToken: string; refreshToken: string }) {
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  },
};
