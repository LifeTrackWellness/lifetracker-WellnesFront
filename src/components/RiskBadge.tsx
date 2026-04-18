import type { RiskLevel } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const riskConfig: Record<RiskLevel, { label: string; className: string }> = {
  VERDE: {
    label: "Verde",
    className: "bg-risk-green/15 text-risk-green border-risk-green/30",
  },
  AMARILLO: {
    label: "Amarillo",
    className: "bg-risk-yellow/15 text-risk-yellow border-risk-yellow/40",
  },
  ROJO: {
    label: "Rojo",
    className: "bg-risk-red/15 text-risk-red border-risk-red/30",
  },
};

export function RiskBadge({
  level,
  label,
  className,
}: {
  level: RiskLevel;
  label?: string;
  className?: string;
}) {
  const config = riskConfig[level];
  if (!config) return null;
  return (
    <Badge variant="outline" className={cn("font-medium", config.className, className)}>
      {label ?? config.label}
    </Badge>
  );
}