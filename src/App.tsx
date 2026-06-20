import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';

// Layout
import { Layout } from './components/Layout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';

// Patient Pages
import {
  PatientDashboard,
  MedicalTimeline,
  ConsentCentre,
  QRCard,
  MedicineVerification,
  HealthTracker,
  HealthAnalytics,
  ProfileSetup,
} from './pages/patient';

// Doctor Pages
import { DoctorDashboard, PrescribeModule } from './pages/doctor';

// Hospital Pages
import { HospitalDashboard, BlockchainExplorer, MedicineSafety } from './pages/hospital';

// Pharmacy Pages
import { PharmacyDashboard } from './pages/pharmacy';

// Government Pages
import { GovernmentDashboard } from './pages/government';

// Insurance Pages
import { InsuranceDashboard } from './pages/insurance';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const role = useAuthStore((state) => state.role);

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role}`} replace />;
  }

  return <>{children}</>;
}

function App() {
  const { isDarkMode } = useAuthStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes with Layout */}
        <Route element={<Layout />}>
          {/* Patient Routes */}
          <Route
            path="/patient"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/timeline"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <MedicalTimeline />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/consent"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <ConsentCentre />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/qr-card"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <QRCard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/verify-medicine"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <MedicineVerification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/health-tracker"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <HealthTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/analytics"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <HealthAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/setup"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <ProfileSetup />
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/prescribe"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <PrescribeModule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/patient/:id"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Hospital Routes */}
          <Route
            path="/hospital"
            element={
              <ProtectedRoute allowedRoles={['hospital']}>
                <HospitalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospital/admissions"
            element={
              <ProtectedRoute allowedRoles={['hospital']}>
                <HospitalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospital/blockchain"
            element={
              <ProtectedRoute allowedRoles={['hospital']}>
                <BlockchainExplorer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospital/medicine-safety"
            element={
              <ProtectedRoute allowedRoles={['hospital']}>
                <MedicineSafety />
              </ProtectedRoute>
            }
          />

          {/* Pharmacy Routes */}
          <Route
            path="/pharmacy"
            element={
              <ProtectedRoute allowedRoles={['pharmacy']}>
                <PharmacyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy/verify"
            element={
              <ProtectedRoute allowedRoles={['pharmacy']}>
                <PharmacyDashboard />
              </ProtectedRoute>
            }
          />

          {/* Government Routes */}
          <Route
            path="/government"
            element={
              <ProtectedRoute allowedRoles={['government']}>
                <GovernmentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Insurance Routes */}
          <Route
            path="/insurance"
            element={
              <ProtectedRoute allowedRoles={['insurance']}>
                <InsuranceDashboard />
              </ProtectedRoute>
            }
          />

          {/* Shared Routes */}
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
