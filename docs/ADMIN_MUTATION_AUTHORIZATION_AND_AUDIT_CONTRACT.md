# Administrative Mutation Authorization and Audit Contract

**Status:** proposed contract and acceptance criteria only. No admin UI, API enforcement, immutable audit store, or tests are claimed implemented.

## Scope and ownership

This document governs the contract expected for privileged administrative mutations exposed by Aether AI Admin. Admin is a presentation/workflow client; the owning domain API remains authoritative for resources and state. Security policy owns policy decisions, Auth owns identity/session lifecycle, and the approved audit owner/store must be named before implementation. The UI cannot grant permissions, establish tenant membership, or serve as the final authorization gate.

This contract does not approve candidate roles, define canonical tenant/workspace membership ownership, or resolve ADR-0021.

## Required operation contract

Every privileged operation must have a versioned contract that specifies:
- Stable operation ID and target resource type.
- Required permission/action and authoritative authorization decision source.
- Trusted actor/principal context and resource/tenant scope derived server-side.
- Request schema, field-level constraints, maximum payload, and stable error categories.
- Whether the action is read-only, reversible, destructive, or security-sensitive.
- Confirmation requirements, idempotency/replay semantics, timeout behavior, and recovery/rollback plan.
- Required audit event fields and the owning audit service/store.
- Expected behavior if Auth, policy evaluation, audit persistence, or the domain dependency is unavailable.

Unknown or missing permission mappings must deny by default. Client-supplied role names, tenant IDs, hidden buttons, route guards, confirmation dialogs, and stale cached UI state are not authorization evidence.

## Mutation lifecycle

1. Authenticate the caller using the approved session/principal contract.
2. Validate the request schema and resolve the target resource from trusted server-side data.
3. Evaluate current authorization for the exact action and resource scope immediately before execution.
4. For high-impact actions, bind confirmation to a canonical summary/hash of the intended operation; any change to target or material fields invalidates the confirmation.
5. Enforce an idempotency key or explicit duplicate-submission strategy where retries can repeat effects.
6. Execute through the owning domain API, which must enforce its own authorization boundary rather than trusting the Admin UI.
7. Record the outcome in the approved audit path with correlation and stable event identifiers. If audit durability is mandatory for this action, do not report success or proceed with irreversible effects until that requirement is met.
8. Return a sanitized result and correlation ID. Never return secrets or raw upstream error bodies.
9. Refresh authoritative state; a client timeout means outcome unknown, not automatically failed. Query operation status or safely retry using the same idempotency key.

The exact ordering of audit persistence and irreversible effects must be defined per operation. This document does not assume a distributed transaction exists.

## Audit event minimum

For security-sensitive changes, the approved audit event should capture:
- Event ID, schema version, UTC timestamp, correlation/request ID.
- Authenticated actor reference and effective permission/policy decision reference.
- Action/operation and target resource reference, scoped to avoid leaking unrelated tenant data.
- Outcome category, including denied, failed, completed, and outcome-unknown where applicable.
- Change summary or approved before/after fields, excluding secrets and unnecessary personal data.
- Confirmation and idempotency reference when applicable.
- Origin/context fields only where approved and necessary for investigation.

Protect audit records from unauthorized modification/deletion; restrict audit search/export separately from mutation permissions. Audit records must be encoded safely for viewers and exports. Never log passwords, tokens, secret values, raw provider payloads, or full user content by default.

## Revocation and stale permissions

Before executing a privileged mutation, re-check current authorization at the server-side enforcement point. A permission or session revoked after page load must not remain usable because the browser still displays an enabled control. If the authorization service or required policy data is unavailable, deny the mutation unless an explicitly approved, narrowly scoped emergency policy says otherwise. Any emergency override must have separate permission, bounded scope, expiry, and auditable justification.

## Failure and recovery semantics

- Validation failure: no side effect; return a stable error category.
- Authorization denial: no side effect; emit a safe denial audit event when the audit contract permits.
- Dependency timeout: report outcome as unknown when execution may have occurred; do not blindly repeat a mutation.
- Duplicate idempotency key with matching request: return the recorded outcome or status.
- Reuse of an idempotency key with different request content: reject.
- Audit persistence failure: follow the operation's declared durability rule; never silently claim an auditable high-impact change succeeded if required audit evidence is missing.
- Partial failure: expose a sanitized state and documented recovery path; do not imply atomic rollback unless verified by the owning service.

## Proposed acceptance matrix

These are proposed future tests, not tests already run.

| Scenario | Required result |
|---|---|
| Anonymous caller invokes privileged operation | Denied server-side |
| Low-privilege operator changes provider/security config | Denied with no side effect |
| Client tampers with role or tenant fields | Trusted authorization context prevails; unauthorized request denied |
| Resource belongs to a different tenant/scope | Denied without leaking its details |
| Permission revoked after page load | Mutation denied at execution time |
| Policy/Auth dependency unavailable | Fail closed for privileged action |
| Confirmation summary changes before submit | Prior confirmation invalidated |
| Same idempotency key and same request retried | No duplicate effect |
| Same idempotency key reused with different body | Rejected |
| Request times out after possible execution | Outcome marked unknown; safe status reconciliation available |
| Audit store unavailable for mandatory-audit operation | Follow declared durability gate; never silently claim success |
| Secret included in request or upstream error | Secret absent from response and audit event |
| Audit viewer has insufficient privilege | Denied; no data returned |
| XSS/log-injection payload in actor/resource labels | Rendered/exported safely; no forged audit entry |
| Cross-tenant audit export | Denied or strictly scoped; no unrelated records |
| High-impact mutation succeeds | Attributable audit event and correlation ID available |
| Rollback/recovery after partial failure | Matches operation-specific documented recovery behavior |

## Release gate

Before any production implementation, each operation needs a reviewed permission matrix, authoritative resource/tenant scoping rule, API schema, idempotency strategy, audit durability rule, failure-state mapping, and executable positive/negative tests in a non-production environment. Security review must confirm that audit access is independently restricted and that the UI is not the sole enforcement point.

## Related references

- [Admin security review](SECURITY_REVIEW.md)
- [Admin technical design](TECHNICAL_DESIGN.md)
- [Admin dependency contracts](DEPENDENCIES_AND_CONTRACTS.md)
- [Security policy decision contract](https://github.com/Monupatel62/aether-ai-security/blob/main/docs/POLICY_DECISION_CONTRACT_AND_ACCEPTANCE.md)
- [Auth session and token revocation contract](https://github.com/Monupatel62/aether-ai-auth/blob/main/docs/SESSION_AND_TOKEN_REVOCATION_CONTRACT.md)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

## Open decisions

Candidate role definitions, MFA/step-up requirements, audit-store ownership and integrity mechanism, audit retention, emergency-access policy, and ADR-0021 membership authority remain unresolved.
