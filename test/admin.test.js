import test from "node:test";
import assert from "node:assert/strict";
import { AuditError, createAuditService } from "../src/index.js";

const base = { tenantId: "tenant-a", actorId: "user-1", action: "file.read", resourceType: "file", resourceId: "file-1", outcome: "success" };
function fixture(overrides = {}) {
  const events = [];
  const service = createAuditService({ store: { async append(event) { events.push(event); } }, clock: () => 123, ...overrides });
  return { service, events };
}

test("persists a structured audit event with bounded allowlisted details", async () => {
  const { service, events } = fixture();
  const result = await service.record({ ...base, details: { reasonCode: "policy_allow", policyVersion: 4, prompt: "private prompt", authorization: "secret", nested: { text: "secret" } } });
  assert.equal(result.persisted, true);
  assert.equal(events[0].occurredAt, 123);
  assert.deepEqual(events[0].details, { reasonCode: "policy_allow", policyVersion: 4 });
});

test("rejects malformed event metadata and unsupported outcomes", async () => {
  const { service } = fixture();
  await assert.rejects(service.record({ ...base, outcome: "maybe" }), AuditError);
  await assert.rejects(service.record({ ...base, actorId: "" }), AuditError);
  await assert.rejects(service.record({ ...base, details: [] }), AuditError);
});

test("does not expose audit-store errors", async () => {
  const service = fixture({ store: { append: async () => { throw new Error("private database content"); } } }).service;
  await assert.rejects(service.record(base), (e) => e.code === "audit_store_unavailable" && !e.message.includes("private"));
});

test("does not serialize arbitrary details or nested values", async () => {
  const { service, events } = fixture();
  await service.record({ ...base, details: { requestId: "req-1", rawBody: "sensitive", prompt: "secret", resourceVersion: { value: 2 } } });
  assert.deepEqual(events[0].details, { requestId: "req-1" });
  assert.equal("prompt" in events[0], false);
});
