// types/security.types.ts

export interface Session {
    id: string;
    deviceName: string;
    browser: string;
    operatingSystem: string;
    ipAddress: string;
    location: string;
    lastActive: string;
    current: boolean;
  }
  
  export interface TwoFactorSetup {
    qrCode: string;
    secret: string;
  }
  
  export interface PasswordUpdate {
    currentPassword: string;
    newPassword: string;
  }
  
  export interface VerificationResponse {
    success: boolean;
    message: string;
  }
  
  export interface SecurityState {
    twoFactorEnabled: boolean;
    twoFactorSetup: TwoFactorSetup | null;
    isEmailVerified: boolean;
    twoFactorStep: 'setup' | 'verify' | 'disable' | 'enabled' | 'disabled' | 'complete';
    activeSessions: Session[];
    twoFactorMethod: TwoFactorMethod | null;
    loading: boolean;

    error: string | null;
  }
  
  export type TwoFactorMethod = 'authenticator' | 'sms' | 'email';