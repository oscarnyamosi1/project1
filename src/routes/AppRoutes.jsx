import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import Landing from '@/pages/Landing/Landing';
import Login from '@/pages/Login/Login';
import Register from '@/pages/Register/Register';
import ForgotPassword from '@/pages/ForgotPassword/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword/ResetPassword';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Markets from '@/pages/Markets/Markets';
import Portfolio from '@/pages/Portfolio/Portfolio';
import Wallet from '@/pages/Wallet/Wallet';
import Transactions from '@/pages/Transactions/Transactions';
import Analytics from '@/pages/Analytics/Analytics';
import Profile from '@/pages/Profile/Profile';
import Settings from '@/pages/Settings/Settings';
import NotFound from '@/pages/NotFound/NotFound';

import LiveTrading from '@/pages/LiveTrading/LiveTrading';
import DemoTrading from '@/pages/DemoTrading/DemoTrading';
import AdminControls from '@/pages/AdminControls/AdminControls';
import Deposit from '@/pages/Deposit/Deposit';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />

    <Route path="/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/markets"        element={<ProtectedRoute><Markets /></ProtectedRoute>} />
    <Route path="/portfolio"      element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
    <Route path="/investments"    element={<Navigate to="/portfolio" replace />} />
    <Route path="/wallet"         element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
    <Route path="/transactions"   element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
    <Route path="/analytics"      element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
    <Route path="/profile"        element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/settings"       element={<ProtectedRoute><Settings /></ProtectedRoute>} />

    <Route path="/live-trading"   element={<ProtectedRoute><LiveTrading /></ProtectedRoute>} />
    <Route path="/demo-trading"   element={<ProtectedRoute><DemoTrading /></ProtectedRoute>} />
    <Route path="/admin-controls" element={<ProtectedRoute><AdminControls /></ProtectedRoute>} />
    <Route path="/deposit"        element={<ProtectedRoute><Deposit /></ProtectedRoute>} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
