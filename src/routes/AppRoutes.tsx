import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import InternList from '../pages/InternList';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import HRDashboard from '../components/dashboard/HRDashboard';
import CoordinatorDashboard from '../components/dashboard/CoordinatorDashboard';
import MentorDashboard from '../components/dashboard/MentorDashboard';
import InternDashboard from '../components/dashboard/InternDashboard';
import AccessDenied from '../pages/AccessDenied';
import UnderDevelopment from '../pages/UnderDevelopment';
import ProfilePage from '../pages/Profile';
import Chat from '../pages/Chat';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        {/* Admin Routes - all handled by AdminDashboard with internal tabs */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminDashboard />} />
        <Route path="/admin/departments" element={<AdminDashboard />} />
        <Route path="/admin/config" element={<AdminDashboard />} />
        <Route path="/admin/logs" element={<AdminDashboard />} />

        {/* Other role dashboards */}
        <Route path="/hr/dashboard" element={<HRDashboard />} />
        <Route path="/hr/interns" element={<InternList />} />
        <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
        <Route path="/mentor/dashboard" element={<MentorDashboard />} />
        <Route path="/intern/dashboard" element={<InternDashboard />} />

        {/* Chat for Intern, Mentor, Coordinator */}
        <Route path="/chat" element={<Chat />} />

        {/* Profile & other pages */}
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/dashboard" element={<InternDashboard />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="/under-development" element={<UnderDevelopment />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
