import api from "@/lib/axiosConfig";
import type { PlanRule, EvaluationLog } from "@/types";

export const planRuleService = {
  list: (planId: number) =>
    api.get<PlanRule[]>(`/api/plans/${planId}/rules`).then((r) => r.data),

  toggle: (planId: number, ruleId: number, active: boolean) =>
    api.patch<PlanRule>(`/api/plans/${planId}/rules/${ruleId}/toggle?active=${active}`).then((r) => r.data),

  save: (planId: number, rules: PlanRule[]) =>
    api.post<PlanRule[]>(`/api/plans/${planId}/rules/save`, rules).then((r) => r.data),

  getEvaluationLog: (planId: number) =>
    api.get<EvaluationLog[]>(`/api/plans/${planId}/rules/evaluation-log`).then((r) => r.data),
};