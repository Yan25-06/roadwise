export type VehicleType = "motorbike" | "car" | "bus" | "truck";

export type RuleStatus = "draft" | "approved" | "rejected" | "deactivated";

/** A traffic restriction extracted from a public notice. */
export interface TrafficRule {
  id: string;
  street: string;
  /** Segment boundaries, e.g. from "Lý Thường Kiệt" to "3 Tháng 2". */
  from: string;
  to: string;
  /** Direction that is closed: "forward" means from → to. */
  direction: "forward" | "backward" | "both";
  vehicles: VehicleType[];
  exceptions: VehicleType[];
  startsAt: Date;
  /** null when the notice gives no end ("until further notice"). */
  endsAt: Date | null;
  status: RuleStatus;
  sourceUrl: string;
  /** Fields the LLM could not read with confidence. */
  flaggedFields: string[];
}

/** Only approved rules inside their effective period affect routing. */
export function isRuleActive(rule: TrafficRule, at: Date): boolean {
  if (rule.status !== "approved") return false;
  if (at < rule.startsAt) return false;
  if (rule.endsAt !== null && at >= rule.endsAt) return false;
  return true;
}

/** Whether a rule blocks a given vehicle (exceptions win over the ban list). */
export function appliesToVehicle(rule: TrafficRule, vehicle: VehicleType): boolean {
  if (rule.exceptions.includes(vehicle)) return false;
  return rule.vehicles.includes(vehicle);
}

/** The human gate: a draft with flagged fields cannot be approved. */
export function canApprove(rule: TrafficRule): boolean {
  return rule.status === "draft" && rule.flaggedFields.length === 0;
}
