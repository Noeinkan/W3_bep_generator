import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Bell, Globe, Palette, Database, Shield, Save, Bot } from 'lucide-react';

const PREFERRED_MODEL_KEY = 'preferredOllamaModel';
const DEFAULT_MODEL = 'llama3.2:3b';

const SettingsPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    // Account Settings
    emailNotifications: true,
    projectUpdates: true,
    weeklyDigest: false,

    // Privacy Settings
    profileVisibility: 'team',
    showEmail: false,

    // Appearance
    theme: 'light',
    language: 'en',

    // Data & Storage
    autosaveInterval: '30',
    keepDrafts: '90'
  });

  const [showSaveMessage, setShowSaveMessage] = useState(false);

  // AI model selection — persisted in localStorage
  const [selectedModel, setSelectedModel] = useState(
    () => localStorage.getItem(PREFERRED_MODEL_KEY) || DEFAULT_MODEL
  );
  const [availableModels, setAvailableModels] = useState([DEFAULT_MODEL]);
  const [modelsLoading, setModelsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ai/models')
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(data => {
        const names = data.available_models || [DEFAULT_MODEL];
        setAvailableModels(names.length ? names : [DEFAULT_MODEL]);
        // If persisted selection is no longer available, reset to default
        if (!names.includes(selectedModel)) {
          setSelectedModel(DEFAULT_MODEL);
        }
      })
      .catch(() => {
        // ML service offline — keep the default list, user can still see their saved choice
      })
      .finally(() => setModelsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(PREFERRED_MODEL_KEY, selectedModel);
  }, [selectedModel]);

  const handleSave = () => {
    // TODO: Save to backend
    console.log('Saving settings:', settings);
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  const SettingSection = ({ icon: Icon, title, children }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center mb-4">
        <Icon className="w-5 h-5 text-blue-600 mr-3" />
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const ToggleSetting = ({ label, description, checked, onChange }) => (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  const SelectSetting = ({ label, value, onChange, options }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your application preferences and account settings
          </p>
        </div>

        {/* Success Message */}
        {showSaveMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Settings saved successfully!
            </p>
          </div>
        )}

        {/* AI Settings */}
        <SettingSection icon={Bot} title="AI Model">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ollama Model
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Choose which local model powers AI suggestions and EIR analysis.
              Pull additional models with <code className="bg-gray-100 px-1 rounded">ollama pull &lt;model&gt;</code>.
            </p>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={modelsLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            >
              {availableModels.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            {modelsLoading && (
              <p className="text-xs text-gray-400 mt-1">Loading available models…</p>
            )}
          </div>
        </SettingSection>

        {/* Notifications */}
        <SettingSection icon={Bell} title="Notifications">
          <ToggleSetting
            label="Email Notifications"
            description="Receive email notifications for important updates"
            checked={settings.emailNotifications}
            onChange={(val) => setSettings({ ...settings, emailNotifications: val })}
          />
          <ToggleSetting
            label="Project Updates"
            description="Get notified when projects you're involved in are updated"
            checked={settings.projectUpdates}
            onChange={(val) => setSettings({ ...settings, projectUpdates: val })}
          />
          <ToggleSetting
            label="Weekly Digest"
            description="Receive a weekly summary of your activity"
            checked={settings.weeklyDigest}
            onChange={(val) => setSettings({ ...settings, weeklyDigest: val })}
          />
        </SettingSection>

        {/* Privacy */}
        <SettingSection icon={Shield} title="Privacy & Security">
          <SelectSetting
            label="Profile Visibility"
            value={settings.profileVisibility}
            onChange={(val) => setSettings({ ...settings, profileVisibility: val })}
            options={[
              { value: 'private', label: 'Private - Only me' },
              { value: 'team', label: 'Team - Project members' },
              { value: 'public', label: 'Public - Everyone' }
            ]}
          />
          <ToggleSetting
            label="Show Email Address"
            description="Display your email on your public profile"
            checked={settings.showEmail}
            onChange={(val) => setSettings({ ...settings, showEmail: val })}
          />
        </SettingSection>

        {/* Appearance */}
        <SettingSection icon={Palette} title="Appearance">
          <SelectSetting
            label="Theme"
            value={settings.theme}
            onChange={(val) => setSettings({ ...settings, theme: val })}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'auto', label: 'Auto (System)' }
            ]}
          />
        </SettingSection>

        {/* Language */}
        <SettingSection icon={Globe} title="Language & Region">
          <SelectSetting
            label="Language"
            value={settings.language}
            onChange={(val) => setSettings({ ...settings, language: val })}
            options={[
              { value: 'en', label: 'English' },
              { value: 'it', label: 'Italiano' },
              { value: 'es', label: 'Español' },
              { value: 'fr', label: 'Français' },
              { value: 'de', label: 'Deutsch' }
            ]}
          />
        </SettingSection>

        {/* Data & Storage */}
        <SettingSection icon={Database} title="Data & Storage">
          <SelectSetting
            label="Autosave Interval"
            value={settings.autosaveInterval}
            onChange={(val) => setSettings({ ...settings, autosaveInterval: val })}
            options={[
              { value: '15', label: 'Every 15 seconds' },
              { value: '30', label: 'Every 30 seconds' },
              { value: '60', label: 'Every minute' },
              { value: '300', label: 'Every 5 minutes' }
            ]}
          />
          <SelectSetting
            label="Keep Drafts For"
            value={settings.keepDrafts}
            onChange={(val) => setSettings({ ...settings, keepDrafts: val })}
            options={[
              { value: '30', label: '30 days' },
              { value: '90', label: '90 days' },
              { value: '180', label: '6 months' },
              { value: 'forever', label: 'Forever' }
            ]}
          />
        </SettingSection>

        {/* Password Change */}
        <SettingSection icon={Lock} title="Password & Security">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
              Change Password
            </button>
          </div>
        </SettingSection>

        {/* Save Button */}
        <div className="flex justify-end space-x-3 mb-8">
          <button
            onClick={handleSave}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save className="w-4 h-4 mr-2" />
            Save All Settings
          </button>
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Settings are currently stored locally. Full synchronization across devices will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
