import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CheckInSummary } from "@/services/checkInService";

interface CheckInHistoryListProps {
  summaries: CheckInSummary[];
  onOpenDetail: (checkInId: number | null) => void;
}

export function CheckInHistoryList({
  summaries,
  onOpenDetail,
}: CheckInHistoryListProps) {
  return (
    <div className="space-y-2">
      {summaries.map((summary) => {
        const completed = summary.status === "COMPLETADO";

        return (
          <Card key={summary.date} className="overflow-hidden">
            <button
              type="button"
              onClick={() => onOpenDetail(summary.checkInId)}
              disabled={!completed}
              className={cn(
                "flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors",
                completed ? "hover:bg-accent/50" : "cursor-default"
              )}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="text-2xl leading-none">
                  {completed ? summary.emotionalStateIcon : "–"}
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium capitalize">
                    {format(parseISO(summary.date), "EEEE d 'de' MMMM", { locale: es })}
                  </p>
                  <Badge
                    variant={completed ? "default" : "secondary"}
                    className={cn("mt-1", completed && "checkin-badge-completed")}
                  >
                    {completed ? "Completado" : "Sin registro"}
                  </Badge>
                </div>
              </div>

              {completed && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
            </button>
          </Card>
        );
      })}
    </div>
  );
}
