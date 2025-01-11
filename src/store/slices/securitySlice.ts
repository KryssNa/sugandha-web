// store/slices/securitySlice.ts
import { securityService } from '@/services/security.service';
import type { SecurityState, TwoFactorMethod } from '@/types/security.types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState: SecurityState = {
    twoFactorEnabled: false,
    twoFactorSetup: null,
    isEmailVerified: false,
    twoFactorStep: 'setup',
    twoFactorMethod: null,
    activeSessions: [],
    loading: false,
    error: null
};

// Async Thunks

export const getTwoFactorStatus = createAsyncThunk<{
    twoFactorEnabled: boolean;
    method: TwoFactorMethod | null;
}>(
    'security/getTwoFactorStatus',
    async (_, { rejectWithValue }) => {
        try {
            const response: { twoFactorEnabled: boolean; twoFactorMethod: TwoFactorMethod | null } = await securityService.getTwoFactorStatus();
            return {
                twoFactorEnabled: response.twoFactorEnabled,
                method: response.twoFactorMethod
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get 2FA status');
        }
    }
);

export const setupTwoFA = createAsyncThunk(
    'security/setupTwoFA',
    async (method: TwoFactorMethod, { rejectWithValue }) => {
        try {
            return await securityService.setupTwoFA(method);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to setup 2FA');
        }
    }
);

export const enableTwoFA = createAsyncThunk(
    'security/enableTwoFA',
    async (token: string, { rejectWithValue }) => {
        try {
            return await securityService.enableTwoFA(token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to enable 2FA');
        }
    }
);

export const disableTwoFA = createAsyncThunk(
    'security/disableTwoFA',
    async (token: string, { rejectWithValue }) => {
        try {
            return await securityService.disableTwoFA(token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to disable 2FA');
        }
    }
);

export const sendVerificationEmail = createAsyncThunk(
    'security/sendVerificationEmail',
    async (_, { rejectWithValue }) => {
        try {
            return await securityService.sendVerificationEmail();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send verification email');
        }
    }
);

export const verifyEmail = createAsyncThunk(
    'security/verifyEmail',
    async (token: string, { rejectWithValue }) => {
        try {
            return await securityService.verifyEmail(token);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to verify email');
        }
    }
);

export const updatePassword = createAsyncThunk(
    'security/updatePassword',
    async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string },
        { rejectWithValue }) => {
        try {

            const response = await securityService.updatePassword({ currentPassword, newPassword });
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.errors ?? error.response?.data?.message );
        }
    }
);

export const getActiveSessions = createAsyncThunk(
    'security/getActiveSessions',
    async (_, { rejectWithValue }) => {
        try {
            return await securityService.getActiveSessions();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get active sessions');
        }
    }
);

export const terminateSession = createAsyncThunk(
    'security/terminateSession',
    async (sessionId: string, { rejectWithValue }) => {
        try {
            await securityService.terminateSession(sessionId);
            return sessionId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to terminate session');
        }
    }
);

const securitySlice = createSlice({
    name: 'security',
    initialState,
    reducers: {
        resetTwoFASetup: (state) => {
            state.twoFactorSetup = null;
            state.twoFactorStep = 'setup';
        },
        setTwoFactorStep: (state, action) => {
            state.twoFactorStep = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder

            // Get 2FA Status
            .addCase(getTwoFactorStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTwoFactorStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.twoFactorEnabled = action.payload ? action.payload.twoFactorEnabled : false;
                state.twoFactorMethod = action.payload ? action.payload.method : null;
            })
            // Setup 2FA
            .addCase(setupTwoFA.pending, (state) => {
                state.loading = true;
                state.error = null;

            })
            .addCase(setupTwoFA.fulfilled, (state, action) => {
                state.loading = false;
                state.twoFactorSetup = action.payload;
                state.twoFactorStep = 'verify';
            })
            .addCase(setupTwoFA.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Enable 2FA
            .addCase(enableTwoFA.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(enableTwoFA.fulfilled, (state) => {
                state.loading = false;
                state.twoFactorEnabled = true;
                state.twoFactorSetup = null;
                state.twoFactorStep = 'complete';
            })
            .addCase(enableTwoFA.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Disable 2FA
            .addCase(disableTwoFA.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(disableTwoFA.fulfilled, (state) => {
                state.loading = false;
                state.twoFactorEnabled = false;
                state.twoFactorStep = 'disabled';
            })
            .addCase(disableTwoFA.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Verify Email
            .addCase(verifyEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyEmail.fulfilled, (state) => {
                state.loading = false;
                state.isEmailVerified = true;
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Get Active Sessions
            .addCase(getActiveSessions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getActiveSessions.fulfilled, (state, action) => {
                state.loading = false;
                state.activeSessions = action.payload;
            })
            .addCase(getActiveSessions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Terminate Session
            .addCase(terminateSession.fulfilled, (state, action) => {
                state.activeSessions = state.activeSessions.filter(
                    session => session.id !== action.payload
                );
            })
            .addCase(terminateSession.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            // Update Password
            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state) => {
                state.loading = false;

            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
            });

    }
});

export const { resetTwoFASetup, setTwoFactorStep, clearError } = securitySlice.actions;
export default securitySlice.reducer;