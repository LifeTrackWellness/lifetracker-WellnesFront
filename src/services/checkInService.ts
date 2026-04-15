import api from "@/lib/axiosConfig";

export interface TodayTask {
  id: number;
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

export interface CheckInSummary {
  date: string;
  status: "COMPLETADO" | "NO_REGISTRADO";
  emotionalState: string | null;
  emotionalStateIcon: string | null;
  checkInId: number | null;
}

export interface CheckInDetailTask {
  taskId: number;
  taskName: string;
  taskDescription: string;
  completed: boolean;
  barrier: string | null;
  barrierLabel: string | null;
}

export interface CheckInDetail {
  id: number;
  checkInDate: string;
  emotionalState: string;
  emotionalStateIcon: string;
  emotionalStateLabel: string;
  createdAt: string;
  updatedAt: string;
  tasks: CheckInDetailTask[];
}

export const checkInService = {
  getEmotionalStates: (patientId: number) =>
    api
      .get<string[]>(`/api/patients/${patientId}/check-in/emotional-states`)
      .then((r) => r.data),

  getTodayTasks: (patientId: number) =>
    api
      .get<TodayTask[]>(`/api/patients/${patientId}/check-in/today-tasks`)
      .then((r) => r.data),

  submit: (patientId: number, payload: CheckInPayload) =>
    api
      .post(`/api/patients/${patientId}/check-in`, payload)
      .then((r) => r.data),

  update: (patientId: number, payload: CheckInPayload) =>
    api
      .put(`/api/patients/${patientId}/check-in`, payload)
      .then((r) => r.data),

  getClosing: (patientId: number) =>
    api
      .get<ClosingResponse>(`/api/patients/${patientId}/check-in/closing`)
      .then((r) => r.data),

  getToday: (patientId: number) =>
    api
      .get<TodayCheckIn>(`/api/patients/${patientId}/check-in/today`)
      .then((r) => r.data),

  getLast30Days: (patientId: number) =>
    api
      .get<CheckInSummary[]>(`/api/patients/${patientId}/check-in/last-30-days`)
      .then((r) => r.data),

  getDetail: (patientId: number, checkInId: number) =>
    api
      .get<CheckInDetail>(`/api/patients/${patientId}/check-in/${checkInId}/detail`)
      .then((r) => r.data),
};
  getEmotionalStates: (patientId: number) =>
    api
      .get<string[]>(`/api/patients/${patientId}/check-in/emotional-states`)
      .then((r) => r.data),

  getTodayTasks: (patientId: number) =>
    api
      .get<TodayTask[]>(`/api/patients/${patientId}/check-in/today-tasks`)
      .then((r) => r.data),

  submit: (patientId: number, payload: CheckInPayload) =>
    api
      .post(`/api/patients/${patientId}/check-in`, payload)
      .then((r) => r.data),

  update: (patientId: number, payload: CheckInPayload) =>
    api
      .put(`/api/patients/${patientId}/check-in`, payload)
      .then((r) => r.data),

  getClosing: (patientId: number) =>
    api
      .get<ClosingResponse>(`/api/patients/${patientId}/check-in/closing`)
      .then((r) => r.data),

  getToday: (patientId: number) =>
    api
      .get<TodayCheckIn>(`/api/patients/${patientId}/check-in/today`)
      .then((r) => r.data),
};