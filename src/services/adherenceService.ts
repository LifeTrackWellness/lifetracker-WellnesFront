import api from "@/lib/axiosConfig";

export interface AdherenceSnapshot {
  id: number;
  snapshotDate: string;
  weeklyCompliance: number;
  monthlyCompliance: number;
  currentStreak: number;
  consistency: number;
}

export const adherenceService = {
  getLatestSnapshot: (patientId: number) =>
    api.get<AdherenceSnapshot>(`/api/patients/${patientId}/adherence/snapshot`)
       .then((r) => r.data),

  getAllSnapshots: (patientId: number) =>
    api.get<AdherenceSnapshot[]>(`/api/patients/${patientId}/adherence/snapshots`)
       .then((r) => r.data),
};