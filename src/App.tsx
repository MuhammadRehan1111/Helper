import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import WorkerProfile from './pages/WorkerProfile';
import SearchPage from './pages/Search';
import Jobs from './pages/Jobs';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import HelpSupport from './pages/HelpSupport';
import PaymentMethods from './pages/PaymentMethods';
import AccountSecurity from './pages/AccountSecurity';
import SavedAddresses from './pages/SavedAddresses';
import Favorites from './pages/Favorites';
import BookWorker from './pages/BookWorker';
import ChatRoom from './pages/ChatRoom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import AdminDashboard from './pages/AdminDashboard';
import PostJob from './pages/PostJob';
import Tracking from './pages/Tracking';
import WorkerDashboard from './pages/WorkerDashboard';
import WorkerRequests from './pages/WorkerRequests';
import AIProcessing from './pages/AIProcessing';
import WorkerRecommendations from './pages/WorkerRecommendations';
import AgentTrace from './pages/AgentTrace';
import ScheduleManager from './pages/ScheduleManager';
import { AppProvider, useAppContext } from './lib/AppContext';

function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: string }) {
  const { currentUser } = useAppContext();
  if (!currentUser) return <Navigate to="/splash" />;
  if (role && currentUser.role !== role) {
    if (currentUser.role === 'admin') return <Navigate to="/admin" />;
    if (currentUser.role === 'worker') return <Navigate to="/worker-dashboard" />;
    return <Navigate to="/" />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <AppProvider>
      <div className="bg-slate-100 min-h-screen">
        <div className="max-w-md mx-auto min-h-screen shadow-2xl bg-background overflow-x-hidden border-x relative">
          <Router>
            <Routes>
              {/* Public Auth & Onboarding */}
              <Route path="/splash" element={<Splash />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
              
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<ProtectedRoute role="user"><Home /></ProtectedRoute>} />
                <Route path="search" element={<SearchPage />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="messages" element={<Messages />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="help" element={<HelpSupport />} />
                <Route path="payments" element={<PaymentMethods />} />
                <Route path="security" element={<AccountSecurity />} />
                <Route path="addresses" element={<SavedAddresses />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="post-job" element={<PostJob />} />
                <Route path="tracking/:id" element={<Tracking />} />
                
                {/* Worker Routes */}
                <Route path="/worker-dashboard" element={<ProtectedRoute role="worker"><WorkerDashboard /></ProtectedRoute>} />
                <Route path="/worker-requests" element={<ProtectedRoute role="worker"><WorkerRequests /></ProtectedRoute>} />
                <Route path="schedule" element={<ProtectedRoute role="worker"><ScheduleManager /></ProtectedRoute>} />
                
                {/* AI Workflow Routes */}
                <Route path="ai-processing" element={<AIProcessing />} />
                <Route path="recommendations" element={<WorkerRecommendations />} />
                <Route path="agent-trace" element={<AgentTrace />} />
              </Route>
              
              {/* Full Screen Routes */}
              <Route path="/worker/:id" element={<ProtectedRoute><WorkerProfile /></ProtectedRoute>} />
              <Route path="/book/:id" element={<ProtectedRoute role="user"><BookWorker /></ProtectedRoute>} />
              <Route path="/chat/:id" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
            </Routes>
          </Router>
        </div>
      </div>
    </AppProvider>
  );
}
