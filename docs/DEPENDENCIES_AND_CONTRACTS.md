# Dependencies and Contracts — aether-ai-admin

**Status:** Proposed contracts; not approved or implemented.

## Dependency direction
Admin may consume public contracts from API, auth, security, observability, and shared UI packages. Those lower-level components must not import admin internals.

## API contract requirements
Each operation must specify:
- Versioned request/response schema and stable error categories.
- Required permission, tenant/resource scope, and audit event.
- Input size/type limits, pagination, timeout, retry, and idempotency behavior.
- Correlation ID propagation and redaction rules.
- Expected behavior when policy, identity, or a dependency is unavailable.

## High-impact operations
Provider configuration changes, model enable/disable, quota changes, user suspension, and policy updates require explicit permission mapping, confirmation, auditability, and defined rollback/recovery behavior. No operation may return raw credentials.

## Error handling
Use stable public error codes; do not expose stack traces, provider responses containing secrets, or internal topology. Retry only when the operation is safe or idempotent.

## Data ownership
Admin owns UI state and presentation logic only. The owning domain API remains authoritative for users, policy, provider configuration, quotas, and audit records. Never couple admin to private tables.
