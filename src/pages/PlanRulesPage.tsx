import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ruleTemplateService } from "@/services/ruleTemplateService";
import { planRuleService } from "@/services/planRuleService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import type { RuleTemplate, PlanRule } from "@/types";

export default function PlanRulesPage() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const planIdNum = Number(planId);

  // Estado local de configuración
  const [config, setConfig] = useState<Record<number, {
    active: boolean;
    umbral: number;
  }>>({});

  // Cargar plantillas disponibles
  const { data: templates = [], isLoading: loadingTemplates } = useQuery({
    queryKey: ["ruleTemplates"],
    queryFn: ruleTemplateService.list,
  });

  // Cargar reglas del plan
  const { data: planRules = [], isLoading: loadingRules } = useQuery({
    queryKey: ["planRules", planIdNum],
    queryFn: () => planRuleService.list(planIdNum),
    enabled: !!planIdNum,
  });

  // Inicializar config cuando cargan los datos
  useEffect(() => {
    if (templates.length === 0) return;

    const initial: Record<number, { active: boolean; umbral: number }> = {};

    templates.forEach((template) => {
      const existing = planRules.find(
        (r) => r.ruleTemplate.id === template.id
      );
      initial[template.id] = {
        active: existing?.active ?? false,
        umbral: existing?.umbralPersonalizado ?? template.umbralDefault,
      };
    });

    setConfig(initial);
  }, [templates, planRules]);

  const handleToggle = (templateId: number, active: boolean) => {
    setConfig((prev) => ({
      ...prev,
      [templateId]: { ...prev[templateId], active },
    }));
  };

  const handleUmbral = (templateId: number, value: string, template: RuleTemplate) => {
    const num = Number(value);
    if (isNaN(num)) return;
    if (num < template.umbralMin || num > template.umbralMax) return;
    setConfig((prev) => ({
      ...prev,
      [templateId]: { ...prev[templateId], umbral: num },
    }));
  };

  const handleSave = async () => {
    try {
      const rules: PlanRule[] = templates
        .filter((t) => config[t.id]?.active)
        .map((t) => ({
          id: planRules.find((r) => r.ruleTemplate.id === t.id)?.id ?? 0,
          ruleTemplate: t,
          umbralPersonalizado: config[t.id]?.umbral ?? t.umbralDefault,
          active: true,
        }));

      await planRuleService.save(planIdNum, rules);
      toast.success("Configuración guardada correctamente");
    } catch {
      toast.error("Error al guardar la configuración");
    }
  };

  if (loadingTemplates || loadingRules) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Volver
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Reglas del Plan</CardTitle>
          <p className="text-sm text-muted-foreground">
            Activa o desactiva reglas automáticas para este plan
          </p>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.description}
                  </p>

                  {config[template.id]?.active && (
                    <div className="mt-3 flex items-center gap-2">
                      <label className="text-sm text-muted-foreground">
                        Umbral (min: {template.umbralMin} — max: {template.umbralMax}):
                      </label>
                      <Input
                        type="number"
                        className="w-24"
                        value={config[template.id]?.umbral ?? template.umbralDefault}
                        min={template.umbralMin}
                        max={template.umbralMax}
                        onChange={(e) => handleUmbral(template.id, e.target.value, template)}
                      />
                    </div>
                  )}
                </div>

                <Switch
                  checked={config[template.id]?.active ?? false}
                  onCheckedChange={(val) => handleToggle(template.id, val)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleSave} className="w-full">
        Guardar configuración
      </Button>

      <EvaluationLogSection planId={planIdNum} />
    </div>
  );
}

function EvaluationLogSection({ planId }: { planId: number }) {
  const [open, setOpen] = useState(false);

  const { data: logs = [], isLoading, isError } = useQuery({
    queryKey: ["planRuleEvaluationLog", planId],
    queryFn: () => planRuleService.getEvaluationLog(planId),
    enabled: !!planId,
  });

  useEffect(() => {
    if (isError) toast.error("Error al cargar el historial de evaluaciones");
  }, [isError]);

  const sorted = [...logs].sort(
    (a, b) => new Date(b.evaluationDate).getTime() - new Date(a.evaluationDate).getTime()
  );

  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer flex-row items-center justify-between">
            <CardTitle>Historial de evaluaciones</CardTitle>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : sorted.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No hay evaluaciones registradas aún
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Regla</TableHead>
                    <TableHead>Cumplimiento</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {format(new Date(log.evaluationDate), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>{log.planRule.ruleTemplate.name}</TableCell>
                      <TableCell>{log.complianceValue}%</TableCell>
                      <TableCell>
                        {log.triggered ? (
                          <Badge className="bg-status-critical/15 text-status-critical border-status-critical/30 border">
                            Disparada 🔴
                          </Badge>
                        ) : (
                          <Badge className="bg-status-active/15 text-status-active border-status-active/30 border">
                            No disparada
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}