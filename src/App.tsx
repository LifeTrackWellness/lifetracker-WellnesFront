import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
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
import { authService } from "@/services/authService";

const queryClient = new QueryClient();

// Componente que protege rutas — si no hay sesión, redirige al login
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>

          {/* Rutas públicas — sin sidebar, sin autenticación */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Rutas protegidas — requieren JWT válido */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
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