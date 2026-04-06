export type PatientStatus = "ACTIVO" | "INACTIVO";
export type HealthStatus = "CRITICO" | "ESTABLE" | "EN_OBSERVACION" | "LEVE";
export type PlanStatus = "ACTIVO" | "INACTIVO";
export type DeactivationReason = "ALTA_MEDICA" | "ABANDONO_PERDIDA_SEGUIMIENTO";

export interface ClinicalInfo {
  id: number;
  mainCondition: string;
  secondaryConditions: string;
  healthStatus: HealthStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: number;
  name: string;
  lastName: string;
  identityDocument: string;
  email: string;
  phoneNumber: string;
  status: PatientStatus;
  deactivationReason: string | null;
  deactivatedAt: string | null;
  createdAt: string;
  clinicalInfo: ClinicalInfo | null;
}


export interface PatientListDTO {
  id: number;
  name: string;
  lastName: string;
  identityDocument: string;
  email: string;
  phoneNumber: string;
  status: PatientStatus;
  mainCondition?: string;
  healthStatus?: HealthStatus;
}

export interface HabitTask {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export interface HabitPlan {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: PlanStatus;
  createdAt: string;
  tasks: HabitTask[];
}

export interface HealthStatusHistory {
  id: number;
  previousStatus: HealthStatus;
  newStatus: HealthStatus;
  reason: string;
  changedAt: string;
}

export interface RuleTemplate {
  id: number;
  name: string;
  description: string;
  umbralDefault: number;
  umbralMin: number;
  umbralMax: number;
}

export interface PlanRule {
  id: number;
  ruleTemplate: RuleTemplate;
  umbralPersonalizado: number;
  active: boolean;
}