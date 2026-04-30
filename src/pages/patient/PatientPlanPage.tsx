import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Calendar } from "lucide-react";
import { patientMeService } from "@/services/patientMeService";

export default function PatientPlanPage() {
  const { data: plan, isLoading, isError } = useQuery({
    queryKey: ["me-plan"],
    queryFn: () => patientMeService.getActivePlan().catch(() => null),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !plan) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold tracking-tight">Mi plan</h1>
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">
              Aún no tienes un plan asignado.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Mi plan</h1>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">{plan.name}</CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {plan.status}
            </Badge>
          </div>
          {plan.description && (
            <p className="text-sm text-muted-foreground">{plan.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {formatDate(plan.startDate)} — {formatDate(plan.endDate)}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-foreground px-1">
          Tareas del plan ({plan.tasks?.length ?? 0})
        </h2>
        {plan.tasks && plan.tasks.length > 0 ? (
          plan.tasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="py-4">
                <p className="font-medium text-foreground">{task.name}</p>
                {task.description && (
                  <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-6 text-center text-sm text-muted-foreground">
              Tu plan aún no tiene tareas.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}