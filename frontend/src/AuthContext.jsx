import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const data = await api.get('/auth/me');
      setTeacher(data.teacher);
    } catch {
      setTeacher(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { checkSession(); }, [checkSession]);

  const login = async (email, password, remember = false) => {
    const data = await api.post('/auth/login', { email, password, remember });
    setTeacher(data.teacher);
    return data.teacher;
  };

  const register = async (fields) => {
    const data = await api.post('/auth/register', fields);
    setTeacher({ ...fields, id: data.teacherId, initials: data.initials, tutorial_done: 0 });
    return data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setTeacher(null);
  };

  const markTutorialDone = async () => {
    await api.post('/auth/tutorial-done');
    setTeacher(prev => ({ ...prev, tutorial_done: 1 }));
  };

  const updateProfile = async (fields) => {
    await api.put('/auth/profile', fields);
    setTeacher(prev => ({ ...prev, ...fields }));
  };

  return (
    <AuthContext.Provider value={{ teacher, loading, login, register, logout, markTutorialDone, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
