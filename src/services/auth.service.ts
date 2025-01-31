
// services/auth.service.ts
import { api } from '@/lib/axios';
import Cookies from 'js-cookie';
import { json } from 'stream/consumers';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  success: boolean;
  data?: any;
  message?: string;
}
interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export const authService = {
  // async register(data: RegisterData): Promise<AuthResponse> {
  //   try {
  //     const response = await api.post('/auth/register', data);
  //     const { tokens, user } = response.data.data;

  //     if (tokens?.accessToken) {
  //       // Set in both cookies and localStorage
  //       Cookies.set('accessToken', tokens.accessToken, {
  //         expires: 7, // 7 days
  //         sameSite: 'strict',
  //         secure: process.env.NODE_ENV === 'production'
  //       });

  //       Cookies.set('refreshToken', tokens.refreshToken, {
  //         expires: 30, // 30 days
  //         sameSite: 'strict',
  //         secure: process.env.NODE_ENV === 'production'
  //       });

  //       localStorage.setItem('accessToken', tokens.accessToken);
  //       localStorage.setItem('refreshToken', tokens.refreshToken);
  //       localStorage.setItem('user', JSON.stringify(user));

  //       // Set default auth header
  //       api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
  //     }

  //     return {
  //       success: true,
  //       data: response.data
  //     };
  //   } catch (error: any) {
  //     return {
  //       success: false,
  //       message: error.response?.data?.errors || 'Registration failed'
  //     };
  //   }
  // },

  // async login(data: LoginData): Promise<AuthResponse> {
  //   try {
  //     const response = await api.post('/auth/login', data);
  //     const { tokens, user } = response.data.data;

  //     if (tokens?.accessToken) {
  //       // Set in both cookies and localStorage
  //       Cookies.set('accessToken', tokens.accessToken, {
  //         expires: 7, // 7 days
  //         sameSite: 'strict',
  //         secure: process.env.NODE_ENV === 'production'
  //       });

  //       Cookies.set('refreshToken', tokens.refreshToken, {
  //         expires: 30, // 30 days
  //         sameSite: 'strict',
  //         secure: process.env.NODE_ENV === 'production'
  //       });

  //       localStorage.setItem('accessToken', tokens.accessToken);
  //       localStorage.setItem('refreshToken', tokens.refreshToken);
  //       localStorage.setItem('user', JSON.stringify(user));

  //       // Set default auth header
  //       api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
  //     }

  //     return {
  //       success: true,
  //       data: response.data
  //     };
  //   } catch (error: any) {
  //     return {
  //       success: false,
  //       message: error.response?.data?.message || 'Login failed'
  //     };
  //   }
  // },

    async register(data: RegisterData): Promise<AuthResponse> {
      try {
        const response = await api.post('/auth/register', data);
        const { tokens, csrfToken, user } = response.data.data;
  
        if (tokens?.accessToken) {
          Cookies.set('accessToken', tokens.accessToken, {
            expires: 7, // 7 days
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
          });
  
          Cookies.set('refreshToken', tokens.refreshToken, {
            expires: 30, // 30 days
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
          });
  
          Cookies.set('csrfToken', csrfToken, {
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
          });
  
          localStorage.setItem('user', JSON.stringify(user));
          api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
        }
  
        return {
          success: true,
          data: response.data,
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.response?.data?.errors || 'Registration failed',
        };
      }
    },
  
    async login(data: LoginData): Promise<AuthResponse> {
      try {
        const response = await api.post('/auth/login', data);
        const { tokens, csrfToken, user } = response.data.data;
  
        if (tokens?.accessToken) {
          Cookies.set('accessToken', tokens.accessToken, {
            expires: 7,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
          });
  
          Cookies.set('refreshToken', tokens.refreshToken, {
            expires: 30,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
          });
  
          Cookies.set('csrfToken', csrfToken, {
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
          });
  
          localStorage.setItem('user', JSON.stringify(user));
          Cookies.set("role",JSON.stringify(user?.role) ,{sameSite: 'strict',secure: process.env.NODE_ENV === 'production',});
          api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
        }
  
        return {
          success: true,
          data: response.data,
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.response?.data?.message || 'Login failed. Please try again.',
        };
      }
    },
  
    async logout() {
      try {
        await api.post('/auth/logout',{withCredentials:true});
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
                
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('role');
        localStorage.clear();
        delete api.defaults.headers.common['Authorization'];
      }
    },
  
  
  async verifyAccessToken(): Promise<boolean> {
    try {
      const token = Cookies.get('accessToken') || localStorage.getItem('accessToken');
      if (!token) return false;

      const response = await api.post('/auth/verify-token', { token });
      return response.data.success;
    } catch (error) {
      return false;
    }
  },
  async getProfile(): Promise<AuthResponse> {
    try {
      const response = await api.get('/users/profile');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profile'
      };
    }
  },

  async updateProfile(data: UpdateProfileData): Promise<AuthResponse> {
    try {
      const response = await api.patch('/users/profile', data);

      // If update is successful, update the stored user data
      if (response.data.success) {
        const updatedUser = response.data.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile'
      };
    }
  },
  async updateProfilePicture(data: FormData): Promise<AuthResponse> {
    try {
      const response = await api.post('/users/profile-picture', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // If update is successful, update the stored user data
      if (response.data.success) {
        const updatedUser = response.data.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile picture'
      };
    }
  },

  // async logout() {
  //   try {
  //     await api.post('/auth/logout');
  //   } catch (error) {
  //     console.error('Logout error:', error);
  //   } finally {
  //     // Clear both cookies and localStorage
  //     Cookies.remove('accessToken');
  //     Cookies.remove('refreshToken');
  //     localStorage.clear();
  //     delete api.defaults.headers.common['Authorization'];
  //   }
  // },

  async getMe(): Promise<AuthResponse> {
    try {
      const response = await api.get('/auth/getMe');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user data'
      };
    }
  },

  getToken(): string | null {
    return Cookies.get('accessToken') || localStorage.getItem('accessToken');
  },

  getStoredUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
};

// types/auth.ts
export interface RequestResetResponse {
  success: boolean;
  message: string;
}

export interface VerifyTokenResponse {
  success: boolean;
  message: string;
  data: {
    tokenValid: boolean;
    email: string;
  }
}

// api/auth.ts
export const requestPasswordReset = async (email: string): Promise<RequestResetResponse> => {
  const response = await api.post('/auth/forgot-password', { email: email });
  return response.data;
};

export const verifyResetToken = async (token: string): Promise<VerifyTokenResponse> => {
  const response = await api.post('/auth/verify-reset-token', { token: token });
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/auth/reset-password', { token, newPassword });
  return response.data;
};

export const verifyEmail = async (token: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/auth/verify-email', { token });
  return response.data;
};