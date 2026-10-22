# Project Specification — aether-ai-admin

**Status:** Proposed; documentation only.

## Mission
Provide a privileged, auditable operator UI for managing model/provider settings, user and access review workflows, policy visibility, quota/usage inspection, and service health.

## Users and access tiers
- Platform operator: only explicitly granted operational capabilities.
- Security/audit reviewer: read-only access to approved audit and policy views.
- Support operator: narrowly scoped support actions; access to user content is not implied.
- Tenant administrator: organization-scoped administration only if enabled by a reviewed product decision.

These roles are candidates, not approved policy. The shared authorization matrix and relevant ADRs are authoritative once accepted.

## Scope
- Admin route protection and accessible status views.
- Typed forms with server-side validation and clear failure states.
- Confirmations and idempotency for high-impact actions.
- Audit-event display with redaction and correlation identifiers.
- Safe configuration editing without secret retrieval.

## Out of scope
- Authentication provider implementation or session authority.
- Defining a second role/membership/ACL store.
- Direct writes to another component's database.
- Model execution, billing ledger ownership, or infrastructure provisioning.
- Client-only authorization and hidden-button-as-security patterns.

## Acceptance gates
- Every privileged operation has a documented server-side permission.
- Tenant and resource scope are explicit.
- Destructive actions have confirmation, audit evidence, and safe retry behavior.
- Sensitive values are never returned to the UI unless there is a reviewed, necessary use case.
- Unit, contract, authorization, negative-input, and dependency-failure tests pass before release.
