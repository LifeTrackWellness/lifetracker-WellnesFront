import api from "@/lib/axiosConfig";

export interface EmotionalState {
  value: string;
  label: string;
}

export interface TodayTask {
  taskId: number;
  name: string;
  description: string;
}

export interface TaskResponse {
  taskId: number;
  completed: boolean;
  barrier?: string | null;
}

export interface CheckInPayload {
  emotionalState: string;
  tasks: TaskResponse[];
}

export interface ClosingResponse {
  streak: number;
  message: string;
}

export interface TodayCheckIn {
  id: number;
  emotionalState: string;
  checkInDate: string;
  tasks: TaskResponse[];
}

export type TaskBarrier =
  | "FALTA_DE_TIEMPO"
  | "OLVIDO"
  | "NO_QUISE"
  | "ME_SENTI_MAL"
  | "OTRO";

export const BARRIER_LABELS: Record<TaskBarrier, string> = {
  FALTA_DE_TIEMPO: "Falta de tiempo",
  OLVIDO: "Olvido",
  NO_QUISE: "No quise",
  ME_SENTI_MAL: "Me sentí mal",
  OTRO: "Otro",
};

export const checkInService = {
  getEmotionalStates: (patientId: number) =>
    api.get<EmotionalState[]>(`/api/patients/${patientId}/check-in/emotional-states`).then((r) => r.data),

  getTodayTasks: (patientId: number) =>
    api.get<TodayTask[]>(`/api/patients/${patientId}/check-in/today-tasks`).then((r) => r.data),

  submit: (patientId: number, payload: CheckInPayload) =>
    api.post(`/api/patients/${patientId}/check-in`, payload).then((r) => r.data),

  update: (patientId: number, payload: CheckInPayload) =>
    api.put(`/api/patients/${patientId}/check-in`, payload).then((r) => r.data),

  getClosing: (patientId: number) =>
    api.get<ClosingResponse>(`/api/patients/${patientId}/check-in/closing`).then((r) => r.data),

  getToday: (patientId: number) =>
    api.get<TodayCheckIn>(`/api/patients/${patientId}/check-in/today`).then((r) => r.data),
};
