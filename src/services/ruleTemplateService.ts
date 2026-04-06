import api from "@/lib/axiosConfig";
import type { RuleTemplate } from "@/types";

export const ruleTemplateService = {
  list: () =>
    api.get<RuleTemplate[]>(`/api/rule-templates`).then((r) => r.data),
};