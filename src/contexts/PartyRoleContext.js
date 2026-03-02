import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'partyRole';

/** @type {'appointing_party' | 'lead_appointed_party' | null} */
const getStoredRole = () => {
  try {
    const v = sessionStorage.getItem(STORAGE_KEY);
    if (v === 'appointing_party' || v === 'lead_appointed_party') return v;
  } catch (_) {}
  return null;
};

const PartyRoleContext = createContext();

export const usePartyRole = () => {
  const context = useContext(PartyRoleContext);
  if (!context) {
    throw new Error('usePartyRole must be used within a PartyRoleProvider');
  }
  return context;
};

export const PARTY_ROLE = {
  APPOINTING_PARTY: 'appointing_party',
  LEAD_APPOINTED_PARTY: 'lead_appointed_party'
};

export const PartyRoleProvider = ({ children }) => {
  const [partyRole, setPartyRoleState] = useState(getStoredRole);

  const setPartyRole = useCallback((role) => {
    if (role === null) {
      sessionStorage.removeItem(STORAGE_KEY);
      setPartyRoleState(null);
      return;
    }
    if (role === PARTY_ROLE.APPOINTING_PARTY || role === PARTY_ROLE.LEAD_APPOINTED_PARTY) {
      sessionStorage.setItem(STORAGE_KEY, role);
      setPartyRoleState(role);
    }
  }, []);

  const clearPartyRole = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setPartyRoleState(null);
  }, []);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        setPartyRoleState(getStoredRole());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value = {
    partyRole,
    setPartyRole,
    clearPartyRole,
    isAppointingParty: partyRole === PARTY_ROLE.APPOINTING_PARTY,
    isLeadAppointedParty: partyRole === PARTY_ROLE.LEAD_APPOINTED_PARTY
  };

  return (
    <PartyRoleContext.Provider value={value}>
      {children}
    </PartyRoleContext.Provider>
  );
};
