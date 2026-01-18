import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Calendar, Save, Lock, Camera, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (isEditing && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isEditing]);

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Email is not valid';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please correct errors before saving');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.put('/api/auth/profile', {
        name: formData.name.trim(),
        email: formData.email.trim()
      });

      if (response.data.success) {
        updateUser(response.data.user);
        setIsEditing(false);
        setValidationErrors({});
        toast.success('Profile updated successfully!');
      } else {
        throw new Error(response.data.message || 'Error saving profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save profile';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setValidationErrors({});
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUserInitials = () => {
    if (!user?.name) return 'DU';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 lg:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 lg:mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-base text-gray-600">
            Manage your account information and personal preferences
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-6 lg:px-8 py-12 lg:py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-5"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }}></div>

            <div className="relative flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative group">
                <div className="w-28 h-28 lg:w-32 lg:h-32 bg-white rounded-2xl shadow-2xl flex items-center justify-center transform transition-transform group-hover:scale-105">
                  <span className="text-4xl lg:text-5xl font-bold text-blue-600">
                    {getUserInitials()}
                  </span>
                </div>
                <button
                  className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                  title="Cambia foto (prossimamente)"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <div className="text-white text-center sm:text-left flex-1">
                <h2 className="text-3xl lg:text-4xl font-bold mb-2 drop-shadow-lg">
                  {user.name || 'Demo User'}
                </h2>
                <p className="text-blue-100 text-lg mb-4 drop-shadow">
                  {user.email || 'email@example.com'}
                </p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    Active Member
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 lg:px-8 py-8 lg:py-10">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name-input"
                    className="flex items-center text-sm font-semibold text-gray-700 mb-3"
                  >
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        id="name-input"
                        ref={firstInputRef}
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (validationErrors.name) {
                            setValidationErrors({ ...validationErrors, name: '' });
                          }
                        }}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none ${
                          validationErrors.name
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                        }`}
                        disabled={isLoading}
                      />
                      {validationErrors.name && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {validationErrors.name}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl">
                      <p className="text-gray-900 font-medium">{user.name || 'Not set'}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email-input"
                    className="flex items-center text-sm font-semibold text-gray-700 mb-3"
                  >
                    <Mail className="w-4 h-4 mr-2 text-blue-600" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        id="email-input"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (validationErrors.email) {
                            setValidationErrors({ ...validationErrors, email: '' });
                          }
                        }}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none ${
                          validationErrors.email
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                        }`}
                        disabled={isLoading}
                      />
                      {validationErrors.email && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {validationErrors.email}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl">
                      <p className="text-gray-900 font-medium">{user.email || 'Not set'}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    Account Created
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl">
                    <p className="text-gray-900 font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">
                    User ID
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl">
                    <p className="text-gray-600 text-sm font-mono break-all">{user.id || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t-2 border-gray-100">
              {isEditing ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-8 py-3.5 border-2 border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:transform-none"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-8 py-3.5 border-2 border-gray-300 rounded-xl shadow-sm text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-8 py-3.5 border-2 border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => toast('Coming soon!', { icon: '🔒' })}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-8 py-3.5 border-2 border-gray-300 rounded-xl shadow-sm text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    Change Password
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-blue-900 leading-relaxed">
            <strong className="font-semibold">ℹ️ Note:</strong> All profile changes are automatically synchronized with the server and are immediately available across all your devices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
