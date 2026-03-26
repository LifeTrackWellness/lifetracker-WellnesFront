import api from "@/lib/axiosConfig";
import type { Patient, PatientListDTO } from "@/types";

export const patientService = {
  create: (data: { name: string; lastName: string; identityDocument: string; email: string; phoneNumber: string }) =>
    api.post<Patient>("/api/patients", data).then((r) => r.data),

  listActive: () => api.get<Patient[]>("/api/patients").then((r) => r.data),

  listInactive: () => api.get<Patient[]>("/api/patients/inactive").then((r) => r.data),

  getById: (id: number) => api.get<Patient>(`/api/patients/${id}`).then((r) => r.data),

  search: (params: { search?: string; status?: string; condition?: string }) =>
    api.get<PatientListDTO[]>("/api/patients/list", { params }).then((r) => r.data),

  updateContact: (id: number, params: { email?: string; phoneNumber?: string }) =>
    api.patch<Patient>(`/api/patients/${id}/contact`, null, { params }).then((r) => r.data),

  deactivate: (id: number, reason: string) =>
    api.patch<Patient>(`/api/patients/${id}/deactivate`, { reason }).then((r) => r.data),

  reactivate: (id: number, data?: { name?: string; lastName?: string; email?: string; phoneNumber?: string }) =>
    api.patch<Patient>(`/api/patients/${id}/reactivate`, data || {}).then((r) => r.data),
};
