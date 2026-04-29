import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import PatientLayout from "@/components/PatientLayout";
import PatientListPage from "@/pages/PatientListPage";
import PatientDetailPage from "@/pages/PatientDetailPage";
import InactivePatientsPage from "@/pages/InactivePatientsPage";
import NotFound from "./pages/NotFound.tsx";
import PlanRulesPage from "@/pages/PlanRulesPage";
import CheckInPage from "@/pages/CheckInPage";
import CheckInHistoryPage from "@/pages/CheckInHistoryPage";
import RiskLevelPanelPage from "@/pages/RiskLevelPanelPage";
import AdherencePage from "@/pages/AdherencePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import ActivateAccountPage from "@/pages/ActivateAccountPage";
import PatientHomePage from "@/pages/patient/PatientHomePage";
import PatientCheckInPage from "@/pages/patient/PatientCheckInPage";
import PatientHistoryPage from "@/pages/patient/PatientHistoryPage";
import PatientPlanPage from "@/pages/patient/PatientPlanPage";
import PatientConsentsPage from "@/pages/patient/PatientConsentsPage";
import { authService } from "@/services/authService";

const queryClient = new QueryClient();

const ProtectedRoute = ({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: "PROFESSIONAL" | "PATIENT";
}) => {
  const user = authService.getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== allowedRole) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/activate" element={<ActivateAccountPage />} />

          {/* Rutas del PACIENTE */}
          <Route
            path="/patient/*"
            element={
              <ProtectedRoute allowedRole="PATIENT">
                <PatientLayout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/patient/home" replace />} />
                    <Route path="/home" element={<PatientHomePage />} />
                    <Route path="/check-in" element={<PatientCheckInPage />} />
                    <Route path="/history" element={<PatientHistoryPage />} />
                    <Route path="/plan" element={<PatientPlanPage />} />
                    <Route path="/consents" element={<PatientConsentsPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </PatientLayout>
              </ProtectedRoute>
            }
          />

          {/* Rutas del PROFESIONAL */}
          <Route
            path="/*"
            element={
              <ProtectedRoute allowedRole="PROFESSIONAL">
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/patients" replace />} />
                    <Route path="/patients" element={<PatientListPage />} />
                    <Route path="/patients/inactive" element={<InactivePatientsPage />} />
                    <Route path="/patients/:id" element={<PatientDetailPage />} />
                    <Route path="/patients/:id/plans/:planId/rules" element={<PlanRulesPage />} />
                    <Route path="/patients/:id/check-in" element={<CheckInPage />} />
                    <Route path="/patients/:id/check-in/history" element={<CheckInHistoryPage />} />
                    <Route path="/risk-level" element={<RiskLevelPanelPage />} />
                    <Route path="/patients/:id/adherence" element={<AdherencePage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
