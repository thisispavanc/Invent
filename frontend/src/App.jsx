import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Users from './pages/admin/Users';
import UserForm from './pages/admin/UserForm';
import DeviceList from './pages/inventory/DeviceList';
import DeviceForm from './pages/inventory/DeviceForm';
import DeviceDetails from './pages/inventory/DeviceDetails';
import EmployeeList from './pages/employees/EmployeeList';
import EmployeeForm from './pages/employees/EmployeeForm';
import EmployeeDetails from './pages/employees/EmployeeDetails';
import AuditLogs from './pages/admin/AuditLogs';
import VerticalDetails from './pages/admin/VerticalDetails';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Area */}
        <Route element={<ProtectedRoute allowedRoles={['super_admin', 'admin', 'employee']} />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Super Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/users/create" element={<UserForm />} />
              <Route path="/admin/users/:id/edit" element={<UserForm />} />
              <Route path="/admin/audit-logs" element={<AuditLogs />} />
              <Route path="/admin/vertical/:verticalName" element={<VerticalDetails />} />
            </Route>

            {/* Inventory & Employee Routes (Admin & Super Admin) */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin', 'admin']} />}>
              <Route path="/inventory" element={<DeviceList />} />
              <Route path="/inventory/new" element={<DeviceForm />} />
              <Route path="/inventory/:id" element={<DeviceDetails />} />
              <Route path="/inventory/:id/edit" element={<DeviceForm />} />

              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/employees/new" element={<EmployeeForm />} />
              <Route path="/employees/:id" element={<EmployeeDetails />} />
              <Route path="/employees/:id/edit" element={<EmployeeForm />} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
