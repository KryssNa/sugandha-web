"use client"
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  LampDesk,
  // DeviceDesktop,
  Loader,
  Lock,
  LogOut,
  Mail,
  RefreshCw,
  Table,
  XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  clearError,
  disableTwoFA,
  enableTwoFA,
  getActiveSessions,
  getTwoFactorStatus,
  resetTwoFASetup,
  sendVerificationEmail,
  setupTwoFA,
  terminateSession,
  updatePassword,
  verifyEmail
} from '@/store/slices/securitySlice';

import useToast from '@/hooks/useToast';
import type { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Button } from '@tremor/react';

const TwoFactorSetup = () => {
  const dispatch = useAppDispatch();
  const {
    twoFactorEnabled,
    twoFactorSetup,
    twoFactorStep,
    twoFactorMethod,
    loading,
    error
  } = useAppSelector((state: RootState) => state.security);
  const [twoFAToken, setTwoFAToken] = useState('');
  const toast = useToast();

  useEffect(() => {
    dispatch(getTwoFactorStatus());
  }, [dispatch]);

  const handleSetup = async () => {
    try {
      await dispatch(setupTwoFA('authenticator')).unwrap();
      toast("success", 'Scan the QR code with your authenticator app');
    } catch (err) {
      toast("error", (err as Error).message);
    }
  };

  const handleVerify = async () => {
    if (twoFAToken.length !== 6) {
      toast("error", 'Please enter a valid 6-digit code');
      return;
    }

    try {
      await dispatch(enableTwoFA(twoFAToken)).unwrap();
      toast("success", 'Two-factor authentication enabled successfully');
      setTwoFAToken('');
    } catch (err) {
      toast("error", error ??"Failed to enable 2FA");
    }
  };

  const handleDisable = async () => {
    try {
      await dispatch(disableTwoFA(twoFAToken)).unwrap();
      toast("success", 'Two-factor authentication disabled successfully');
      setTwoFAToken('');
      dispatch(resetTwoFASetup());
    } catch (err) {
      toast("error", error ??"Failed to disable 2FA");
    }
  };

  if (twoFactorEnabled) {
    return (
      <div className="space-y-4 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500">
              Enter your authenticator code to disable 2FA
            </p>
          </div>
          <span className="px-3 py-[5px] bg-green/10 text-green rounded-xl text-sm">
            Enabled
          </span>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            value={twoFAToken}
            onChange={(e) => setTwoFAToken(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
          />
          <Button
            onClick={handleDisable}
            disabled={loading || twoFAToken.length !== 6}
            loading={loading}
            className='rounded-sm'
          >
            Disable 2FA
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {twoFactorStep === 'setup' && (
        <div className="space-y-4 flex items-center justify-between border border-gray-200 rounded-lg p-6">
          <div>
            <h3 className="text-lg font-medium">Enable Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500">
              Add an extra layer of security to your account
            </p>
          </div>
          <Button onClick={handleSetup} loading={loading}
            className='rounded-md hover:bg-slate-100'
          >
            Get Started
          </Button>
        </div>
      )}

      {twoFactorStep === 'verify' && twoFactorSetup && (
        <div className="space-y-6 border border-gray-200 rounded-lg p-6">
          <div className="text-center p-6 bg-gray-50 rounded-lg ">
            <img
              src={twoFactorSetup.qrCode}
              alt="2FA QR Code"
              className="mx-auto mb-4 w-48 h-48"
            />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Scan this QR code with Google Authenticator or a similar app
              </p>
              <p className="text-xs text-gray-500">
                Secret key: {twoFactorSetup.secret}
              </p>
            </div>
          </div>

          <div className="space-y-4 border-2 border-gray-200 rounded-lg p-4">
            <div>
              <h4 className="font-medium">Verify Setup</h4>
              <p className="text-sm text-gray-500">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>
            <div className="flex gap-4">
              <input
                type="text"
                value={twoFAToken}
                onChange={(e) => setTwoFAToken(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <Button
                onClick={handleVerify}
                disabled={loading || twoFAToken.length !== 6}
                loading={loading}
              >
                Verify & Enable
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SecuritySettings = () => {
  const dispatch = useAppDispatch();
  const {

    activeSessions,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.security);
  const { isEmailVerified } = useAppSelector((state: RootState) => state.auth);

  const [verificationToken, setVerificationToken] = useState('');
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const toast = useToast();

  useEffect(() => {
    dispatch(getActiveSessions());
  }, [dispatch]);

  const handleError = (message: string) => {
    dispatch(clearError());
    console.error("message", message);
  };

  const handleSendCode = async () => {
    try {
      await dispatch(sendVerificationEmail()).unwrap();
      dispatch(clearError());
    } catch (err) {
      handleError((err as Error).message);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationToken.trim()) {
      toast("error", 'Please enter the verification code');
      handleError('Please enter the verification code');
      return;
    }

    try {
      await dispatch(verifyEmail(verificationToken)).unwrap();
      setVerificationToken('');
    } catch (err) {
      toast("error", (err as Error).message);
      handleError((err as Error).message);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast("error", 'All password fields are required');
      handleError('All password fields are required');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast("error", 'New passwords do not match');
      handleError('New passwords do not match');
      return;
    }

    if (passwords.new.length < 8) {
      toast("error", 'New password must be at least 8 characters long');
      handleError('New password must be at least 8 characters long');
      return;
    }

    try {
      await dispatch(updatePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new
      })).unwrap();
      setPasswords({ current: '', new: '', confirm: '' });
      if (error) {
      
      } else {
        toast("success", 'Password updated successfully');
      }
    } catch (errors) {
      console.log("erro", errors);
      if (Array.isArray(errors)) {
        (errors as Error[]).forEach((error: Error) => {
          toast("error", error.message);
        });
      } else {
        toast("error", errors?? 'Failed to update password');
      }
    }

  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      await dispatch(terminateSession(sessionId)).unwrap();
      toast("success", 'Session terminated successfully');
    } catch (err) {
      handleError((err as Error).message);
    }
  };
  const timeAgo = (date: Date) => {
    const diffInMs = Date.now() - date.getTime();
    const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    const timeAgo = new Intl.RelativeTimeFormat('en').format(
      diffInHours < 24 ? -diffInHours : -diffInDays,
      diffInHours < 24 ? 'hour' : 'day'
    );
    return timeAgo;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red/10 border border-red rounded-lg p-4 flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 text-red" />
            <p className="text-red/60">{error}</p>
            <button
              onClick={() => dispatch(clearError())}
              className="ml-auto text-red hover:text-red/60"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Two-Factor Authentication */}
      <TwoFactorSetup />

      {/* sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <LampDesk className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold">Active Sessions</h2>
            </div>
            <button
              onClick={() => dispatch(getActiveSessions())}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Table className="w-5 h-5 text-gray-500" />
                  <div className="flex flex-col">
                    <p className="font-medium text-gray-900">
                      {session.browser} on {session.deviceName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {session.ipAddress} • {session?.location[0] ?? 'Unknown location'}
                    </p>
                    <p className="text-xs text-gray-400">Last active: <span className='text-emerald-900'>{session.current ? "Now" : timeAgo(new Date(session?.lastActive))}</span></p>
                  </div>
                </div>
                {session.current ? (
                  <span className="px-3 py-[5px] bg-green/10 text-green rounded-xl text-sm">
                    Current Session
                  </span>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTerminateSession(session.id)}
                    className="text-red hover:text-red/60"
                  >
                    <LogOut className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email Verification */}
      {!isEmailVerified && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Mail className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold">Email Verification</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={verificationToken}
                  onChange={(e) => setVerificationToken(e.target.value)}
                  placeholder="Enter verification code"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVerifyEmail}
                  disabled={loading || !verificationToken}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg 
                    hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    'Verify Email'
                  )}
                </motion.button>
              </div>
              <p className="text-sm text-gray-500">
                Haven't received the code?{' '}
                <button
                  onClick={handleSendCode}
                  className="text-orange-500 hover:underline"
                  disabled={loading}
                >
                  Send again
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Password Update */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold">Update Password</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Current Password</label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder='Enter current password'
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-700">New Password</label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder='Enter new password'
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder='Confirm new password'
              />
            </div>
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePasswordUpdate}
                disabled={loading || !passwords.current || !passwords.new || !passwords.confirm}
                className="w-[220px] px-6 py-3 bg-orange-500 text-white rounded-lg 
                hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Update Password'
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;