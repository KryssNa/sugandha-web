'use client';

import { motion } from 'framer-motion';
import {
  Bell,
  CreditCard,
  Globe,
  Send,
  Shield,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useState } from 'react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    darkMode: false,
    twoFactorAuth: false,
    language: 'English',
    currency: 'USD'
  });

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  type Setting = {
    name: string;
    label: string;
    description: string;
    togglable?: boolean;
    action?: string;
    type?: string;
    options?: string[];
    value?: string;
  };
  
  const settingSections: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    settings?: Setting[];
    content?: React.ReactNode;
  }[] = [
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          name: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Receive order updates via email',
          togglable: true
        },
        {
          name: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Get notifications on your device',
          togglable: true
        },
        {
          name: 'marketingEmails',
          label: 'Marketing Emails',
          description: 'Receive offers and updates',
          togglable: true
        }
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      settings: [
        {
          name: 'twoFactorAuth',
          label: 'Two-Factor Authentication',
          description: 'Add extra security to your account',
          togglable: true
        },
        {
          name: 'password',
          label: 'Change Password',
          description: 'Update your password',
          action: 'Update'
        }
      ]
    },
    {
      title: 'Payment Methods',
      icon: CreditCard,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-white rounded-md flex items-center justify-center border border-gray-200">
                <img src="/visa.svg" alt="Visa" className="h-4" />
              </div>
              <div>
                <p className="font-medium text-gray-900">•••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/24</p>
              </div>
            </div>
            <button className="text-primary hover:text-primary/80">Edit</button>
          </div>
          <button className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-700 
            hover:bg-gray-50 transition-colors text-center">
            Add New Payment Method
          </button>
        </div>
      )
    },
    {
      title: 'Preferences',
      icon: Globe,
      settings: [
        {
          name: 'language',
          label: 'Language',
          description: 'Choose your preferred language',
          type: 'select',
          options: ['English', 'Spanish', 'French'],
          value: settings.language
        },
        {
          name: 'currency',
          label: 'Currency',
          description: 'Choose your preferred currency',
          type: 'select',
          options: ['USD', 'EUR', 'GBP'],
          value: settings.currency
        },
        {
          name: 'darkMode',
          label: 'Dark Mode',
          description: 'Toggle dark mode on/off',
          togglable: true
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {settingSections.map((section) => (
        <div key={section.title} className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="flex items-center gap-2 font-semibold text-gray-900 mb-6">
              <section.icon className="w-5 h-5 text-primary" />
              {section.title}
            </h2>

            {section.content ? section.content : (
              <div className="space-y-4">
                {section.settings?.map((setting) => (
                  <div key={setting.name} className="flex items-center justify-between p-4 
                    bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{setting.label}</h3>
                      <p className="text-sm text-gray-500">{setting.description}</p>
                    </div>
                    {setting.togglable ? (
                      <button
                        onClick={() => handleToggle(setting.name as keyof typeof settings)}
                        className="relative"
                      >
                        {settings[setting.name as keyof typeof settings] ? (
                          <ToggleRight className="w-10 h-6 text-primary" />
                        ) : (
                          <ToggleLeft className="w-10 h-6 text-gray-400" />
                        )}
                      </button>
                    ) : setting.type === 'select' ? (
                      <select
                        value={setting.value}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          [setting.name]: e.target.value
                        }))}
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none 
                          focus:ring-2 focus:ring-primary/50"
                          title='Notifications'
                      >
                        {setting.options?.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : setting.action && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg 
                          transition-colors"
                      >
                        {setting.action}
                      </motion.button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Save Button */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 
            transition-colors flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Save Changes
        </motion.button>
      </div>
    </div>
  );
};

export default SettingsPage;