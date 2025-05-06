
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import StudentManagement from './components/StudentManagement';
import ComplaintManagement from './components/ComplaintManagement';
import RequestManagement from './components/RequestManagement';
import Settings from './components/Settings';
import Analysis from './components/Analysis';
import AdminPrivateRoute from './components/AdminPrivateRoute';
import AdminNavbar from './components/AdminNavbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default route redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<AdminLogin />} />

          {/* Protected routes */}
          <Route path="/*" element={<AdminNavbar />}>
            <Route path="dashboard" element={
              <AdminPrivateRoute>
                <AdminDashboard />
              </AdminPrivateRoute>
            } />
            <Route path="students" element={
              <AdminPrivateRoute>
                <StudentManagement />
              </AdminPrivateRoute>
            } />
            <Route path="complaints" element={
              <AdminPrivateRoute>
                <ComplaintManagement />
              </AdminPrivateRoute>
            } />
            <Route path="requests" element={
              <AdminPrivateRoute>
                <RequestManagement />
              </AdminPrivateRoute>
            } />
            <Route path="settings" element={
              <AdminPrivateRoute>
                <Settings />
              </AdminPrivateRoute>
            } />
            <Route path="analysis" element={
              <AdminPrivateRoute>
                <Analysis />
              </AdminPrivateRoute>
            } />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
