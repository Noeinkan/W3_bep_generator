import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Bell, Globe, Palette, Database, Shield, Save, Bot, FileText, Plus, Pencil, Trash2 } from 'lucide-react';
import apiService from '../../services/apiService';
import toast from 'react-hot-toast';

const PREFERRED_MODEL_KEY = 'preferredOllamaModel';
const DEFAULT_MODEL = 'llama3.1:8b';

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

  // BEP Snippets (stable text for {{snippet:key}} in labels/placeholders/panels)
  const [snippets, setSnippets] = useState([]);
  const [snippetsLoading, setSnippetsLoading] = useState(true);
  const [snippetForm, setSnippetForm] = useState({ key: '', value: '', classification: '' });
  const [editingId, setEditingId] = useState(null);

  const loadSnippets = useCallback(async () => {
    setSnippetsLoading(true);
    try {
      const res = await apiService.getSnippets();
      setSnippets(res?.data ?? []);
    } catch (err) {
      toast.error('Failed to load snippets');
      setSnippets([]);
    } finally {
      setSnippetsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSnippets();
  }, [loadSnippets]);

  const handleSaveSnippet = async () => {
    if (!snippetForm.key.trim() || snippetForm.value === undefined) {
      toast.error('Key and value are required');
      return;
    }
    try {
      await apiService.createOrUpdateSnippet({
        key: snippetForm.key.trim(),
        value: String(snippetForm.value),
        classification: snippetForm.classification?.trim() || undefined
      });
      toast.success(editingId ? 'Snippet updated' : 'Snippet added');
      setSnippetForm({ key: '', value: '', classification: '' });
      setEditingId(null);
      loadSnippets();
    } catch (err) {
      toast.error(err?.message ?? 'Failed to save snippet');
    }
  };

  const handleEditSnippet = (s) => {
    setSnippetForm({ key: s.key, value: s.value, classification: s.classification || '' });
    setEditingId(s.id);
  };

  const handleUpdateSnippet = async () => {
    if (!editingId) return;
    try {
      await apiService.updateSnippet(editingId, {
        value: String(snippetForm.value),
        classification: snippetForm.classification?.trim() || undefined
      });
      toast.success('Snippet updated');
      setSnippetForm({ key: '', value: '', classification: '' });
      setEditingId(null);
      loadSnippets();
    } catch (err) {
      toast.error(err?.message ?? 'Failed to update snippet');
    }
  };

  const handleDeleteSnippet = async (id) => {
    if (!window.confirm('Delete this snippet? References will show the key until you add it again.')) return;
    try {
      await apiService.deleteSnippet(id);
      toast.success('Snippet deleted');
      if (editingId === id) setEditingId(null);
      loadSnippets();
    } catch (err) {
      toast.error(err?.message ?? 'Failed to delete snippet');
    }
  };

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

        {/* BEP Snippets */}
        <SettingSection icon={FileText} title="BEP text snippets">
          <p className="text-xs text-gray-500 mb-3">
            Stable text used in labels and panels. Use <code className="bg-gray-100 px-1 rounded">{'{{snippet:key}}'}</code> in form config; changing the value here updates every reference.
          </p>
          {snippetsLoading ? (
            <p className="text-sm text-gray-500">Loading snippets…</p>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                <input
                  type="text"
                  placeholder="Key (e.g. appointed_party)"
                  value={snippetForm.key}
                  onChange={(e) => setSnippetForm({ ...snippetForm, key: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  disabled={!!editingId}
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={snippetForm.value}
                  onChange={(e) => setSnippetForm({ ...snippetForm, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Classification (optional)"
                  value={snippetForm.classification}
                  onChange={(e) => setSnippetForm({ ...snippetForm, classification: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={editingId ? handleUpdateSnippet : handleSaveSnippet}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {editingId ? <Pencil className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                    {editingId ? 'Update' : 'Add'} snippet
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => { setEditingId(null); setSnippetForm({ key: '', value: '', classification: '' }); }}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              <ul className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                {snippets.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-gray-500">No snippets yet. Add one above.</li>
                ) : (
                  snippets.map((s) => (
                    <li key={s.id} className="px-4 py-2 flex items-center justify-between gap-2">
                      <span className="font-mono text-sm text-gray-700">{s.key}</span>
                      <span className="flex-1 truncate text-sm text-gray-600" title={s.value}>{s.value}</span>
                      {s.classification && (
                        <span className="text-xs text-gray-400">{s.classification}</span>
                      )}
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditSnippet(s)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 rounded"
                          aria-label="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSnippet(s.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 rounded"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </>
          )}
        </SettingSection>

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
