import api from "@/lib/axiosConfig";
import type { ClinicalInfo, HealthStatus, HealthStatusHistory } from "@/types";

export const clinicalInfoService = {
  register: (patientId: number, data: { mainCondition: string; secondaryConditions: string; healthStatus: HealthStatus }) =>
    api.post<ClinicalInfo>(`/api/patients/${patientId}/clinical-info`, data).then((r) => r.data),

  get: (patientId: number) =>
    api.get<ClinicalInfo>(`/api/patients/${patientId}/clinical-info`).then((r) => r.data),

  update: (patientId: number, data: { mainCondition: string; secondaryConditions: string; healthStatus: HealthStatus }) =>
    api.put<ClinicalInfo>(`/api/patients/${patientId}/clinical-info`, data).then((r) => r.data),

  updateHealthStatus: (patientId: number, data: { healthStatus: HealthStatus; reason: string }) =>
    api.patch<ClinicalInfo>(`/api/patients/${patientId}/clinical-info/health-status`, data).then((r) => r.data),

  getHistory: (patientId: number) =>
    api.get<HealthStatusHistory[]>(`/api/patients/${patientId}/clinical-info/history`).then((r) => r.data),

  getHealthStatuses: (patientId: number) =>
    api.get<string[]>(`/api/patients/${patientId}/clinical-info/health-statuses`).then((r) => r.data),
};
