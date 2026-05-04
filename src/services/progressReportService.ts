import api from "@/lib/axiosConfig";
import { PlanStatus } from "@/types";

export type RiskLevel = "VERDE" | "AMARILLO" | "ROJO";
export type HealthStatus = "CRITICO" | "ESTABLE" | "EN_OBSERVACION" | "LEVE";

export interface RiskDayDTO {
  date: string;
  riskLevel: RiskLevel;
  compliancePercentage: number;
}

export interface HabitPlanDTO {
  name: string;
  startDate: string;
  status: PlanStatus;
}

export interface ConclusionDTO {
  id: number;
  content: string;
  therapistName: string;
  createdAt: string;
}

export interface ProgressReport {
  patientFullName: string;
  therapistFullName: string;
  generatedAt: string;
  weeklyCompliance: number;
  currentStreak: number;
  bestStreak: number;
  last7DaysRisk: RiskDayDTO[];
  highRiskCount: number;
  initialHealthStatus: HealthStatus | null;
  currentHealthStatus: HealthStatus | null;
  initialStatusDate: string | null;
  currentStatusDate: string | null;
  habitPlans: HabitPlanDTO[];
  conclusions: ConclusionDTO[];
}

export const progressReportService = {
  getReport: (patientId: number) =>
    api
      .get<ProgressReport>(`/api/patients/${patientId}/progress-report`)
      .then((r) => r.data),

  addConclusion: (patientId: number, content: string, professionalId: number) =>
    api
      .post(`/api/patients/${patientId}/progress-report/conclusions`, {
        content,
        professionalId,
      })
      .then((r) => r.data),
};