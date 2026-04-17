import api from "@/lib/axiosConfig";
import type { RiskLevelInfo, RiskLevelHistoryEntry } from "@/types";

export const riskLevelService = {
  get: (patientId: number) =>
    api.get<RiskLevelInfo>(`/api/patients/${patientId}/risk-level`).then((r) => r.data),

  evaluate: (patientId: number) =>
    api.post<RiskLevelInfo>(`/api/patients/${patientId}/risk-level/evaluate`).then((r) => r.data),

  history: (patientId: number) =>
    api.get<RiskLevelHistoryEntry[]>(`/api/patients/${patientId}/risk-level/history`).then((r) => r.data),

  evaluateAll: () =>
    api.post<RiskLevelInfo[]>(`/api/risk-level/evaluate-all`).then((r) => r.data),

  listAll: () =>
    api.get<RiskLevelInfo[]>(`/api/risk-level/all`).then((r) => r.data),
};
