import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const autoLogin = async () => {
      try {
        // Check if user is already logged in
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setLoading(false);
          return;
        }

        // Auto-login with default credentials
        const email = 'nome.cognome@libero.it';
        const password = 'Password1234';
        const name = 'Demo User';

        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        let user = existingUsers.find(u => u.email === email);

        // If user doesn't exist, create it
        if (!user) {
          user = {
            id: Date.now().toString(),
            email,
            name,
            password,
            createdAt: new Date().toISOString(),
            projects: []
          };
          const updatedUsers = [...existingUsers, user];
          localStorage.setItem('users', JSON.stringify(updatedUsers));
        }

        // Check password and login
        if (user.password === password) {
          const userForStorage = { ...user };
          delete userForStorage.password;

          setUser(userForStorage);
          localStorage.setItem('currentUser', JSON.stringify(userForStorage));
        }
      } catch (error) {
        console.error('Auto-login failed:', error);
      } finally {
        setLoading(false);
      }
    };

    autoLogin();
  }, []);

  const register = async (userData) => {
    try {
      const { email, password, name } = userData;

      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

      if (existingUsers.find(u => u.email === email)) {
        throw new Error('User with this email already exists');
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        name,
        password,
        createdAt: new Date().toISOString(),
        projects: []
      };

      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      const userForStorage = { ...newUser };
      delete userForStorage.password;

      setUser(userForStorage);
      localStorage.setItem('currentUser', JSON.stringify(userForStorage));

      return { success: true, user: userForStorage };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (credentials) => {
    try {
      const { email, password } = credentials;
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

      const user = existingUsers.find(u => u.email === email);

      if (!user || user.password !== password) {
        throw new Error('Invalid email or password');
      }

      const userForStorage = { ...user };
      delete userForStorage.password;

      setUser(userForStorage);
      localStorage.setItem('currentUser', JSON.stringify(userForStorage));

      return { success: true, user: userForStorage };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUserProjects = (projects) => {
    if (!user) return;

    const updatedUser = { ...user, projects };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = existingUsers.map(u =>
      u.id === user.id ? { ...u, projects } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const resetPassword = async (email) => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const user = existingUsers.find(u => u.email === email);

      if (!user) {
        throw new Error('No account found with that email address');
      }

      // Generate a temporary password
      const tempPassword = Math.random().toString(36).substring(2, 10);

      // Update user's password
      const updatedUsers = existingUsers.map(u =>
        u.email === email ? { ...u, password: tempPassword, passwordResetRequired: true } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // In a real app, this would send an email. For demo purposes, we'll show the temp password
      return {
        success: true,
        message: `Password reset successful! Your temporary password is: ${tempPassword}`,
        tempPassword
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to change your password');
      }

      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const currentUser = existingUsers.find(u => u.id === user.id);

      if (!currentUser || currentUser.password !== currentPassword) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      const updatedUsers = existingUsers.map(u =>
        u.id === user.id ? { ...u, password: newPassword, passwordResetRequired: false } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      return { success: true, message: 'Password changed successfully!' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUserProjects,
    resetPassword,
    changePassword,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};