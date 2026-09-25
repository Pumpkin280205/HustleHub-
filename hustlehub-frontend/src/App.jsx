import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Gigs from './pages/Gigs';
import GigDetail from './pages/GigDetail';
import MyBookings from './pages/MyBookings';
import FreelancerDashboard from './pages/FreelancerDashboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/gigs" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/gigs" element={<ProtectedRoute><Gigs /></ProtectedRoute>} />
          <Route path="/gigs/:id" element={<ProtectedRoute><GigDetail /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute roles={['client', 'freelancer']}><MyBookings /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute roles={['freelancer']}><FreelancerDashboard /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
