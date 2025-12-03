import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import History from './pages/History';
import Routine from './pages/Routine';
import { Home as HomeIcon, User, History as HistoryIcon, Layers } from 'lucide-react';

function Navigation() {
  const location = useLocation();

  // Don't show navigation on login/signup/landing pages
  if (['/login', '/signup', '/'].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 flex justify-around items-center z-50">
      <Link to="/dashboard" className={`flex flex-col items-center ${location.pathname === '/dashboard' ? 'text-emerald-400' : 'text-zinc-500'}`}>
        <HomeIcon className="w-6 h-6" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      <Link to="/history" className={`flex flex-col items-center ${location.pathname === '/history' ? 'text-emerald-400' : 'text-zinc-500'}`}>
        <HistoryIcon className="w-6 h-6" />
        <span className="text-xs mt-1">History</span>
      </Link>
      <Link to="/routine" className={`flex flex-col items-center ${location.pathname === '/routine' ? 'text-emerald-400' : 'text-zinc-500'}`}>
        <Layers className="w-6 h-6" />
        <span className="text-xs mt-1">Routine</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center ${location.pathname === '/profile' ? 'text-emerald-400' : 'text-zinc-500'}`}>
        <User className="w-6 h-6" />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground font-sans">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
            <Route path="/routine" element={<PrivateRoute><Routine /></PrivateRoute>} />
          </Routes>
          <Navigation />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
