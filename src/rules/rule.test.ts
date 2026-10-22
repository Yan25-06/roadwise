import { describe, expect, it } from "vitest";
import { appliesToVehicle, canApprove, isRuleActive, type TrafficRule } from "./rule.js";

const metroWorks: TrafficRule = {
  id: "cmt8-metro2",
  street: "Cách Mạng Tháng Tám",
  from: "Lý Thường Kiệt",
  to: "3 Tháng 2",
  direction: "forward",
  vehicles: ["car", "bus"],
  exceptions: ["bus"],
  startsAt: new Date("2026-08-15T00:00:00+07:00"),
  endsAt: new Date("2026-12-31T00:00:00+07:00"),
  status: "approved",
  sourceUrl: "https://example.org/notice",
  flaggedFields: [],
};

describe("isRuleActive", () => {
  it("is active inside the effective period", () => {
    expect(isRuleActive(metroWorks, new Date("2026-10-22T07:00:00+07:00"))).toBe(true);
  });

  it("is inactive before it starts and from the end time on", () => {
    expect(isRuleActive(metroWorks, new Date("2026-08-14T23:59:00+07:00"))).toBe(false);
    expect(isRuleActive(metroWorks, new Date("2026-12-31T00:00:00+07:00"))).toBe(false);
  });

  it("never activates a draft", () => {
    const draft = { ...metroWorks, status: "draft" as const };
    expect(isRuleActive(draft, new Date("2026-10-22T07:00:00+07:00"))).toBe(false);
  });

  it("stays active with no end date", () => {
    const open = { ...metroWorks, endsAt: null };
    expect(isRuleActive(open, new Date("2030-01-01T00:00:00+07:00"))).toBe(true);
  });
});

describe("appliesToVehicle", () => {
  it("does not block motorbikes on a car-only ban", () => {
    expect(appliesToVehicle(metroWorks, "motorbike")).toBe(false);
    expect(appliesToVehicle(metroWorks, "car")).toBe(true);
  });

  it("lets exceptions through", () => {
    expect(appliesToVehicle(metroWorks, "bus")).toBe(false);
  });
});

describe("canApprove", () => {
  it("blocks approval while any field is flagged", () => {
    const flagged = { ...metroWorks, status: "draft" as const, flaggedFields: ["direction"] };
    expect(canApprove(flagged)).toBe(false);
    expect(canApprove({ ...flagged, flaggedFields: [] })).toBe(true);
  });
});
