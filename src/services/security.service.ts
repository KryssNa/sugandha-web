// services/security.service.ts
import { api } from '@/lib/axios';
import type {
    PasswordUpdate,
    Session,
    TwoFactorMethod,
    TwoFactorSetup,
    VerificationResponse
} from '@/types/security.types';

export const securityService = {
    // Two-Factor Authentication
    async getTwoFactorStatus(): Promise<{ twoFactorEnabled: boolean; twoFactorMethod: TwoFactorMethod | null }> {
        const response = await api.get('/auth/2fa');
        return response.data.data;
    },
    async setupTwoFA(method: TwoFactorMethod): Promise<TwoFactorSetup> {
        const response = await api.post('/auth/2fa/setup', { method });
        return response.data.data;
    },

    async enableTwoFA(token: string): Promise<VerificationResponse> {
        const response = await api.post('/auth/2fa/enable', { token });
        return response.data.data;
    },

    async disableTwoFA(token: string): Promise<VerificationResponse> {
        const response = await api.post('/auth/2fa/disable', { token });
        return response.data.data;
    },

    // Email Verification
    async sendVerificationEmail(): Promise<VerificationResponse> {
        const response = await api.post('/auth/email/verify/send');
        return response.data.data;
    },

    async verifyEmail(token: string): Promise<VerificationResponse> {
        const response = await api.post('/auth/email/verify', { token });
        return response.data.data;
    },

    // Password Management
    async updatePassword(data: PasswordUpdate): Promise<VerificationResponse> {
        const response = await api.post('/auth/password/update', data);
        return response.data.data;
    },

    // Session Management
    async getActiveSessions(): Promise<Session[]> {
        const response = await api.get('/session');
        return response.data.data.sessions;
    },

    async terminateSession(sessionId: string): Promise<VerificationResponse> {
        const response = await api.delete(`/session/${sessionId}`);
        return response.data.data;
    },

    async terminateAllSessions(): Promise<VerificationResponse> {
        const response = await api.delete('/session/all');
        return response.data;
    }
};