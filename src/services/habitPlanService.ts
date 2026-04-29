import api from "@/lib/axiosConfig";
import type { HabitPlan, HabitTask } from "@/types";

export const habitPlanService = {
  create: (patientId: number, data: { name: string; description: string; startDate: string; endDate: string }) =>
    api.post<HabitPlan>(`/api/patients/${patientId}/habit-plans`, data).then((r) => r.data),

  list: (patientId: number) =>
    api.get<HabitPlan[]>(`/api/patients/${patientId}/habit-plans`).then((r) => r.data),

  getActive: (patientId: number) =>
    api.get<HabitPlan>(`/api/patients/${patientId}/habit-plans/active`).then((r) => r.data),

  getById: (patientId: number, planId: number) =>
    api.get<HabitPlan>(`/api/patients/${patientId}/habit-plans/${planId}`).then((r) => r.data),

  update: (patientId: number, planId: number, data: { name: string; description: string; startDate: string; endDate: string }) =>
    api.put<HabitPlan>(`/api/patients/${patientId}/habit-plans/${planId}`, data).then((r) => r.data),

  deactivate: (patientId: number, planId: number) =>
    api.patch<HabitPlan>(`/api/patients/${patientId}/habit-plans/${planId}/deactivate`).then((r) => r.data),

  addTask: (
    patientId: number,
    planId: number,
    data: {
      name: string;
      description: string;
      priority?: "ALTA" | "MEDIA" | "BAJA";
      mandatory?: boolean;
      weeklyGoal?: number;
      specificDays?: string[];
    }
  ) =>
    api.post<HabitTask>(`/api/patients/${patientId}/habit-plans/${planId}/tasks`, data).then((r) => r.data),

  deleteTask: (patientId: number, planId: number, taskId: number) =>
    api.delete(`/api/patients/${patientId}/habit-plans/${planId}/tasks/${taskId}`).then((r) => r.data),
};
