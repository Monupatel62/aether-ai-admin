import { randomUUID } from "node:crypto";

const ID = /^[A-Za-z0-9][A-Za-z0-9._:@/-]{0,255}$/;
const OUTCOMES = new Set(["success", "denied", "failure"]);
const SEVERITIES = new Set(["info", "warning", "critical"]);
const SAFE_DETAIL_KEY = /^[a-z][a-zA-Z0-9_]{0,63}$/;
export class AuditError extends Error {
  constructor(code, message = "Audit operation failed") { super(message); this.name = "AuditError"; this.code = code; }
}
function isRecord(value) { return value !== null && typeof value === "object" && !Array.isArray(value); }
function validId(value) { return typeof value === "string" && ID.test(value) && value.trim() === value; }

export function createAuditService({ store, clock = () => Date.now(), allowedDetailKeys = new Set(["reasonCode", "policyVersion", "requestId", "resourceVersion"]) }) {
  if (!store || typeof store.append !== "function") throw new TypeError("Audit store adapter is required");
  if (typeof clock !== "function" || !(allowedDetailKeys instanceof Set)) throw new TypeError("Clock and detail-key allowlist are required");
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
          if (typeof value === "string" && value.length <= 256) details[key] = value;
          else if (typeof value === "number" && Number.isSafeInteger(value)) details[key] = value;
          else if (typeof value === "boolean") details[key] = value;
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
