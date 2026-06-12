import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Login } from './pages/Login';
import { Dashboard as AdminDashboard } from './pages/admin/Dashboard';
import { StudentDashboard } from './pages/student-portal/StudentDashboard';
import { SuperAdminDashboard } from './pages/super-admin/SuperAdminDashboard';
import { UnifiedDashboard } from './pages/UnifiedDashboard';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Guard component to enforce authentication and routing logic
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect unauthorized context to home
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public authentication portal */}
          <Route path="/" element={<Login />} />

          {/* Super Admin school management endpoint */}
          <Route 
            path="/super-admin" 
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Legacy School Admin / Principal workspace */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Student Portal endpoint */}
          <Route 
            path="/student" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Unified Role Portal Dashboard */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={[
                'super_admin',
                'admin', 
                'teacher', 
                'student', 
                'parent', 
                'org_owner', 
                'school_owner', 
                'vice_principal', 
                'admissions', 
                'reception', 
                'accountant', 
                'hr', 
                'librarian', 
                'transport', 
                'hostel'
              ]}>
                <UnifiedDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

