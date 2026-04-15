import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { checkInService, type CheckInSummary } from "@/services/checkInService";
import { CheckInDetailDialog } from "@/components/dialogs/CheckInDetailDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CalendarDays, List, ChevronRight } from "lucide-react";
import { format, parseISO, startOfWeek, addDays, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

const DAY_HEADERS = ["L", "M", "M", "J", "V", "S", "D"];

export default function CheckInHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const patientId = Number(id);
  const navigate = useNavigate();

  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [selectedCheckInId, setSelectedCheckInId] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data: summaries = [], isLoading, isError } = useQuery({
    queryKey: ["checkInLast30", patientId],
    queryFn: () => checkInService.getLast30Days(patientId),
    enabled: !isNaN(patientId),
  });

  const summaryMap = useMemo(() => {
    const map = new Map<string, CheckInSummary>();
    summaries.forEach((s) => map.set(s.date, s));
    return map;
  }, [summaries]);

  // Build calendar grid from the 30-day range
  const calendarWeeks = useMemo(() => {
    if (summaries.length === 0) return [];
    const dates = summaries.map((s) => parseISO(s.date)).sort((a, b) => a.getTime() - b.getTime());
    const first = dates[0];
    const last = dates[dates.length - 1];

    const weekStart = startOfWeek(first, { weekStartsOn: 1 });
    const weeks: Date[][] = [];
    let current = weekStart;

    while (current <= last || weeks.length === 0) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(addDays(current, i));
      }
      weeks.push(week);
      current = addDays(current, 7);
    }
    return weeks;
  }, [summaries]);

  const openDetail = (checkInId: number | null) => {
    if (checkInId === null) return;
    setSelectedCheckInId(checkInId);
    setDetailOpen(true);
  };

  const sortedForList = useMemo(
    () => [...summaries].sort((a, b) => b.date.localeCompare(a.date)),
    [summaries]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>
        <div className="flex gap-1 border rounded-lg p-0.5">
          <Button
            size="sm"
            variant={view === "calendar" ? "default" : "ghost"}
            onClick={() => setView("calendar")}
            className="gap-1.5"
          >
            <CalendarDays className="h-4 w-4" /> Calendario
          </Button>
          <Button
            size="sm"
            variant={view === "list" ? "default" : "ghost"}
            onClick={() => setView("list")}
            className="gap-1.5"
          >
            <List className="h-4 w-4" /> Lista
          </Button>
        </div>
      </div>

      <h2 className="text-xl font-bold">Historial de Check-ins</h2>
      <p className="text-sm text-muted-foreground">Últimos 30 días</p>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Error al cargar el historial. Intenta de nuevo.
          </CardContent>
        </Card>
      ) : view === "calendar" ? (
        /* ========== CALENDAR VIEW ========== */
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {DAY_HEADERS.map((d, i) => (
                <span key={i} className="text-xs font-medium text-muted-foreground">
                  {d}
                </span>
              ))}
            </div>
            {calendarWeeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
                {week.map((day) => {
                  const key = format(day, "yyyy-MM-dd");
                  const summary = summaryMap.get(key);
                  const inRange = !!summary;
                  const completed = summary?.status === "COMPLETADO";
                  const today = isToday(day);

                  return (
                    <button
                      key={key}
                      disabled={!inRange}
                      onClick={() => completed && openDetail(summary?.checkInId ?? null)}
                      className={cn(
                        "relative flex flex-col items-center justify-center rounded-md h-14 text-sm transition-colors",
                        !inRange && "opacity-30 cursor-default",
                        inRange && completed && "bg-green-100 hover:bg-green-200 cursor-pointer dark:bg-green-900/30 dark:hover:bg-green-900/50",
                        inRange && !completed && "bg-muted cursor-default",
                        today && "ring-2 ring-primary"
                      )}
                    >
                      <span className="text-[10px] text-muted-foreground leading-none mb-0.5">
                        {format(day, "d")}
                      </span>
                      <span className="text-lg leading-none">
                        {inRange ? (completed ? summary?.emotionalStateIcon : "–") : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        /* ========== LIST VIEW ========== */
        <div className="space-y-2">
          {sortedForList.map((item) => {
            const completed = item.status === "COMPLETADO";
            return (
              <Card
                key={item.date}
                className={cn(
                  "transition-colors",
                  completed && "cursor-pointer hover:bg-accent/50"
                )}
                onClick={() => completed && openDetail(item.checkInId)}
              >
                <CardContent className="flex items-center justify-between py-3 px-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.emotionalStateIcon ?? "–"}</span>
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {format(parseISO(item.date), "EEEE d 'de' MMMM", { locale: es })}
                      </p>
                      <Badge
                        variant={completed ? "default" : "secondary"}
                        className={cn(
                          "mt-0.5 text-xs",
                          completed && "bg-green-600 hover:bg-green-700"
                        )}
                      >
                        {completed ? "Completado" : "Sin registro"}
                      </Badge>
                    </div>
                  </div>
                  {completed && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <CheckInDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        patientId={patientId}
        checkInId={selectedCheckInId}
      />
    </div>
  );
}
