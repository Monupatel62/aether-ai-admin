# Technical Design — aether-ai-admin

**Status:** Candidate design; technology choices remain open.

## UI structure
- Protected admin layout and navigation.
- Read-only overview cards for approved service and configuration metadata.
- Feature areas for provider/model configuration, users, policy review, quotas, and audit events, introduced only after contracts are accepted.
- Shared typed API client; no direct database client in the browser.
- Common error, loading, empty, stale-data, and access-denied components.

## Mutation lifecycle
1. Validate the form locally for usability, then validate authoritatively on the server.
2. Present a summary of the intended change and its impact.
3. Require explicit confirmation for high-impact actions.
4. Submit an idempotency key when the API contract supports it.
5. Show a sanitized result and correlation ID.
6. Refresh authoritative state; do not assume a timed-out request failed.

## Security design
- Authorization is checked on every server-side operation, not only route entry.
- CSRF/session controls follow the selected web authentication architecture.
- Secrets are write-only where possible; show configured/not-configured status rather than secret material.
- Audit views enforce least privilege and redact sensitive payloads.
- Avoid storing privileged responses in persistent browser storage.

## Resilience
- Use bounded timeouts and limited retries for safe reads.
- Do not blindly retry mutations without idempotency semantics.
- Show dependency outage as unavailable, never as a successful empty result.
- Protect against stale UI state after permission revocation.

## Observability
Record operation name, outcome category, latency, actor reference where permitted, and correlation ID. Exclude tokens, secret values, and sensitive user content by default.
