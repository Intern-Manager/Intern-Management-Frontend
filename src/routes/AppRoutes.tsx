import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/hr/dashboard" element={<HRDashboard />} />
        <Route path="/hr/interns" element={<InternList />} />
        <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
        <Route path="/mentor/dashboard" element={<MentorDashboard />} />
        <Route path="/intern/dashboard" element={<InternDashboard />} />
        <Route path="/home" element={<Navigate to="/dashboard" replace />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="/under-development" element={<UnderDevelopment />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
