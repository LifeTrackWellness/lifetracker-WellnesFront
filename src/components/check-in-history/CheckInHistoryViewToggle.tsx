import { CalendarDays, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CheckInHistoryView = "calendar" | "list";

interface CheckInHistoryViewToggleProps {
  view: CheckInHistoryView;
  onViewChange: (view: CheckInHistoryView) => void;
}

export function CheckInHistoryViewToggle({
  view,
  onViewChange,
}: CheckInHistoryViewToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Cambiar vista del historial"
      className="inline-flex items-center rounded-xl border bg-card p-1"
    >
      <Button
        type="button"
        size="sm"
        variant={view === "calendar" ? "default" : "ghost"}
        onClick={() => onViewChange("calendar")}
        className={cn("gap-2", view !== "calendar" && "text-muted-foreground")}
        aria-pressed={view === "calendar"}
      >
        <CalendarDays className="h-4 w-4" />
        Calendario
      </Button>
      <Button
        type="button"
        size="sm"
        variant={view === "list" ? "default" : "ghost"}
        onClick={() => onViewChange("list")}
        className={cn("gap-2", view !== "list" && "text-muted-foreground")}
        aria-pressed={view === "list"}
      >
        <List className="h-4 w-4" />
        Lista
      </Button>
    </div>
  );
}
