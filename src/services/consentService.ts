import api from "@/lib/axiosConfig";

export interface ConsentTemplate {
  id: number;
  tipo: string;
  titulo: string;
  contenido: string;
  version: string;
}

export interface PatientConsent {
  id: number;
  aceptado: boolean;
  fechaAceptacion: string | null;
  consentTemplate: ConsentTemplate;
}

export const consentService = {
  getByPatient: (patientId: number) =>
    api.get<PatientConsent[]>(`/api/patients/${patientId}/consents`)
       .then((r) => r.data),

  hasPending: (patientId: number) =>
    api.get<boolean>(`/api/patients/${patientId}/consents/pending`)
       .then((r) => r.data),

  accept: (patientId: number, consentId: number) =>
    api.patch(`/api/patients/${patientId}/consents/${consentId}/accept`)
       .then((r) => r.data),
};