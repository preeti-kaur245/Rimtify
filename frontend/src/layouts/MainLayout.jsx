import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Tutorial from '../components/Tutorial';
import DashboardScreen from '../screens/DashboardScreen';
import MaterialsScreen from '../screens/MaterialsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotesScreen from '../screens/NotesScreen';
import CoursesScreen from '../screens/CoursesScreen';
import { useAuth } from '../AuthContext';
import './MainLayout.css';

export default function MainLayout() {
  const { teacher } = useAuth();
  const [page, setPage] = useState('dashboard');
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (teacher && teacher.tutorial_done === 0) {
      const timer = setTimeout(() => setShowTutorial(true), 600);
      return () => clearTimeout(timer);
    }
  }, [teacher]);

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <DashboardScreen onNav={setPage} />;
      case 'courses': return <CoursesScreen />;
      case 'materials': return <MaterialsScreen />;
      case 'notes': return <NotesScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <DashboardScreen onNav={setPage} />;
    }
  };

  return (
    <div className="main-layout">
      <Navbar active={page} onNav={setPage} />
      <main className="main-content">
        <div className="page-inner fade-up" key={page}>
          {renderPage()}
        </div>
      </main>
      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
    </div>
  );
}
