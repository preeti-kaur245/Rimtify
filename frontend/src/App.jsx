import { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { ToastProvider } from './ToastContext';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainLayout from './layouts/MainLayout';

function AppRouter() {
  const { teacher, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  if (showSplash) return <SplashScreen onDone={() => setShowSplash(false)} />;
  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(100,160,255,.2)', borderTop: '3px solid #1a6fff', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
    </div>
  );
  if (!teacher) {
    if (authMode === 'register') return <RegisterScreen onSwitch={() => setAuthMode('login')} />;
    return <LoginScreen onSwitch={() => setAuthMode('register')} />;
  }
  return <MainLayout />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ToastProvider>
  );
}
