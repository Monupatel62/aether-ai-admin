# Security Review — aether-ai-admin

**Status:** Threat checklist only; no implementation or security test is claimed.

## Threats
- Unauthorized access to privileged routes or actions.
- Cross-tenant data exposure through incorrect filters or stale permissions.
- Stored/reflected XSS through user names, provider metadata, or audit messages.
- CSRF or session misuse for administrative mutations.
- Secret leakage in forms, browser logs, URLs, telemetry, screenshots, or audit output.
- Duplicate or ambiguous mutations after timeout/retry.
- Abuse by a compromised or over-privileged operator.
- Sensitive information exposed through exports or broad audit search.

## Required controls
- Deny-by-default server-side authorization for each resource/action.
- Current tenant/resource authorization; never trust UI visibility or client-supplied role claims.
- Output encoding, strict input validation, secure session/CSRF design, and appropriate CSP.
- Least-privilege roles and separated read/write capabilities.
- Confirmation, idempotency, audit record, and recovery plan for high-impact operations.
- Secret redaction and no secret read-back.
- Rate/usage limits and bounded queries/exports.
- Safe telemetry and no sensitive values in error responses.

## Required verification
- Anonymous and low-privilege denial tests for every privileged action.
- Cross-tenant and revoked-permission tests.
- Malformed payload, XSS, CSRF, replay, timeout, and duplicate-submit tests.
- Secret leakage checks across UI, logs, URLs, and audit views.
- Dependency outage and partial-failure tests.

All items remain unverified until tests are implemented and executed in an approved non-production environment.
