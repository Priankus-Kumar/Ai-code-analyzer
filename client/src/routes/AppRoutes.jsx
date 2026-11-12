import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import useAuth from '../hooks/useAuth.js';

const Landing = lazy(() => import('../pages/Landing.jsx'));
const Login = lazy(() => import('../pages/Login.jsx'));
const Register = lazy(() => import('../pages/Register.jsx'));
const Dashboard = lazy(() => import('../pages/Dashboard.jsx'));
const Analyze = lazy(() => import('../pages/Analyze.jsx'));
const AnalysisDetail = lazy(() => import('../pages/AnalysisDetail.jsx'));
const History = lazy(() => import('../pages/History.jsx'));

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense
      fallback={
        <div className="route-loading" role="status" aria-live="polite">
          Loading page...
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analyze"
          element={
            <ProtectedRoute>
              <Analyze />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analyses/:id"
          element={
            <ProtectedRoute>
              <AnalysisDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 Route */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />}
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
