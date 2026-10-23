import { randomUUID } from "node:crypto";

const ID = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,255}$/;
const OUTCOMES = new Set(["success", "denied", "failure"]);
const SEVERITIES = new Set(["info", "warning", "critical"]);
const SAFE_DETAIL_KEY = /^[a-z][a-zA-Z0-9_]{0,63}$/;
const DEFAULT_DETAIL_KEYS = new Set(["reasonCode", "policyVersion", "requestId", "resourceVersion"]);
export class AuditError extends Error {
  constructor(code, message = "Audit operation failed") { super(message); this.name = "AuditError"; this.code = code; }
}
function isRecord(value) { return value !== null && typeof value === "object" && !Array.isArray(value); }
function validId(value) { return typeof value === "string" && ID.test(value) && value.trim() === value; }

export function createAuditService({ store, clock = () => Date.now(), allowedDetailKeys = new Set(DEFAULT_DETAIL_KEYS) }) {
  if (!store || typeof store.append !== "function") throw new TypeError("Audit store adapter is required");
  if (typeof clock !== "function" || !(allowedDetailKeys instanceof Set)) throw new TypeError("Clock and detail-key allowlist are required");
  if ([...allowedDetailKeys].some((key) => !DEFAULT_DETAIL_KEYS.has(key))) throw new TypeError("Detail keys cannot expand the built-in privacy allowlist");
  return Object.freeze({
    async record(input) {
      if (!isRecord(input) || !validId(input.tenantId) || !validId(input.actorId) || !validId(input.action)
        || !validId(input.resourceType) || !validId(input.resourceId) || !OUTCOMES.has(input.outcome)
        || !SEVERITIES.has(input.severity ?? "info")) throw new AuditError("invalid_event");
      const details = {};
      if (input.details !== undefined) {
        if (!isRecord(input.details)) throw new AuditError("invalid_details");
        for (const [key, value] of Object.entries(input.details)) {
          if (!SAFE_DETAIL_KEY.test(key) || !allowedDetailKeys.has(key)) continue;
          if (key === "reasonCode" && typeof value === "string" && /^[a-z][a-z0-9_.-]{0,63}$/.test(value)) details[key] = value;
          else if ((key === "policyVersion" || key === "resourceVersion") && Number.isSafeInteger(value) && value >= 0) details[key] = value;
          else if (key === "requestId" && typeof value === "string" && /^[A-Za-z0-9._:-]{1,128}$/.test(value)) details[key] = value;
        }
      }
      const event = Object.freeze({
        id: randomUUID(), schemaVersion: 1, tenantId: input.tenantId, actorId: input.actorId,
        action: input.action, resourceType: input.resourceType, resourceId: input.resourceId,
        outcome: input.outcome, severity: input.severity ?? "info", occurredAt: clock(),
        details: Object.freeze(details),
      });
      try { await store.append(event); } catch { throw new AuditError("audit_store_unavailable", "Audit event could not be persisted"); }
      return Object.freeze({ id: event.id, persisted: true });
    },
  });
}
