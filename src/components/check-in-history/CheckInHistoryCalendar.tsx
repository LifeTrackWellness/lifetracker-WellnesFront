import { useMemo } from "react";
import { addDays, format, isToday, parseISO, startOfWeek } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CheckInSummary } from "@/services/checkInService";

const DAY_HEADERS = ["L", "M", "M", "J", "V", "S", "D"];

interface CheckInHistoryCalendarProps {
  summaries: CheckInSummary[];
  onOpenDetail: (checkInId: number | null) => void;
}

export function CheckInHistoryCalendar({
  summaries,
  onOpenDetail,
}: CheckInHistoryCalendarProps) {
  const summaryByDate = useMemo(
    () => new Map(summaries.map((summary) => [summary.date, summary])),
    [summaries]
  );

  const calendarWeeks = useMemo(() => {
    if (summaries.length === 0) {
      return [] as Date[][];
    }

    const orderedDates = summaries
      .map((summary) => parseISO(summary.date))
      .sort((a, b) => a.getTime() - b.getTime());

    const firstVisibleDay = startOfWeek(orderedDates[0], { weekStartsOn: 1 });
    const lastWeekStart = startOfWeek(orderedDates[orderedDates.length - 1], {
      weekStartsOn: 1,
    });
    const lastVisibleDay = addDays(lastWeekStart, 6);

    const weeks: Date[][] = [];

    for (
      let currentWeekStart = firstVisibleDay;
      currentWeekStart <= lastVisibleDay;
      currentWeekStart = addDays(currentWeekStart, 7)
    ) {
      weeks.push(
        Array.from({ length: 7 }, (_, index) => addDays(currentWeekStart, index))
      );
    }

    return weeks;
  }, [summaries]);

  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <div className="grid grid-cols-7 gap-1 text-center">
          {DAY_HEADERS.map((day, index) => (
            <span
              key={`${day}-${index}`}
              className="text-xs font-medium text-muted-foreground"
            >
              {day}
            </span>
          ))}
        </div>

        <div className="space-y-1">
          {calendarWeeks.map((week) => (
            <div key={format(week[0], "yyyy-MM-dd")} className="grid grid-cols-7 gap-1">
              {week.map((day) => {
                const date = format(day, "yyyy-MM-dd");
                const summary = summaryByDate.get(date);
                const completed = summary?.status === "COMPLETADO";
                const clickable = completed && summary.checkInId !== null;

                return (
                  <button
                    key={date}
                    type="button"
                    disabled={!clickable}
                    onClick={() => onOpenDetail(summary?.checkInId ?? null)}
                    className={cn(
                      "checkin-day",
                      summary
                        ? completed
                          ? "checkin-day-completed"
                          : "checkin-day-missing"
                        : "checkin-day-outside",
                      isToday(day) && "checkin-day-today",
                      clickable ? "hover:bg-accent/60" : "cursor-default"
                    )}
                    aria-label={
                      summary
                        ? `Registro del ${date}: ${summary.status.toLowerCase()}`
                        : `Día fuera del rango: ${date}`
                    }
                  >
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {format(day, "d")}
                    </span>
                    <span className="text-2xl leading-none">
                      {summary ? (completed ? summary.emotionalStateIcon : "–") : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
