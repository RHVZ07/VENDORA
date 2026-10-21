import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainLayout from './components/layouts/MainLayout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import VendorList from './pages/admin/VendorList';
import VendorDetails from './pages/admin/VendorDetails';
import OnboardingRequests from './pages/admin/OnboardingRequests';
import OnboardingReview from './pages/admin/OnboardingReview';
import EvaluationList from './pages/admin/EvaluationList';
import EvaluationCreate from './pages/admin/EvaluationCreate';
import POList from './pages/admin/POList';
import POCreate from './pages/admin/POCreate';
import PODetails from './pages/admin/PODetails';
import DocumentManager from './pages/admin/DocumentManager';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorOnboardingWizard from './pages/vendor/VendorOnboardingWizard';
import VendorProfile from './pages/vendor/VendorProfile';
import VendorDocuments from './pages/vendor/VendorDocuments';
import VendorPOs from './pages/vendor/VendorPOs';
import VendorPODetails from './pages/vendor/VendorPODetails';
import VendorPerformance from './pages/vendor/VendorPerformance';
import VendorNotifications from './pages/vendor/VendorNotifications';
import VendorSettings from './pages/vendor/VendorSettings';

import NotFound from './pages/NotFound';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner text="Authenticating user session..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/vendor/dashboard'} replace />;
  }

  return children;
};

// Root index redirect based on role
const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner text="Connecting to VENDORA..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/vendor/dashboard'} replace />;
};

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Root Path Redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Protected App Routes inside Main Layout */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Admin Specific Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendors"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <VendorList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendors/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <VendorDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding-requests"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <OnboardingRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding-requests/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <OnboardingReview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/evaluations"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EvaluationList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/evaluations/create"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EvaluationCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchase-orders/create"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <POCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Vendor Specific Routes */}
        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/profile"
          element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorOnboardingWizard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/performance"
          element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorPerformance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorNotifications />
            </ProtectedRoute>
          }
        />

        {/* Shared / Role-Adaptive Routes */}
        <Route
          path="/purchase-orders"
          element={
            user?.role === 'admin' ? <POList /> : <VendorPOs />
          }
        />
        <Route
          path="/purchase-orders/:id"
          element={
            user?.role === 'admin' ? <PODetails /> : <VendorPODetails />
          }
        />
        <Route
          path="/documents"
          element={
            user?.role === 'admin' ? <DocumentManager /> : <VendorDocuments />
          }
        />
        <Route
          path="/settings"
          element={
            user?.role === 'admin' ? <Settings /> : <VendorSettings />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
