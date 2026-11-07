import { createContext, useContext, useMemo, useState } from 'react';
import api from '../api/axiosInstance.js';

const AuthContext = createContext(null);
const tokenKey = 'studentClubToken';
const memberKey = 'studentClubMember';

export function AuthProvider({ children }) {
  const [member, setMember] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(memberKey)) || null;
    } catch {
      return null;
    }
  });

  function saveSession(session) {
    localStorage.setItem(tokenKey, session.token);
    localStorage.setItem(memberKey, JSON.stringify(session.member));
    setMember(session.member);
  }

  function updateMember(nextMember) {
    localStorage.setItem(memberKey, JSON.stringify(nextMember));
    setMember(nextMember);
  }

  async function login(credentials) {
    const { data } = await api.post('/auth/login', credentials);
    saveSession(data);
  }

  async function register(details) {
    const { data } = await api.post('/auth/register', details);
    saveSession(data);
  }

  async function becomeMember() {
    const { data } = await api.patch('/auth/membership');
    updateMember(data.member);
  }

  function logout() {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(memberKey);
    setMember(null);
  }

  const value = useMemo(() => ({
    member,
    isAdmin: member?.role === 'ADMIN',
    login,
    register,
    becomeMember,
    logout,
  }), [member]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
