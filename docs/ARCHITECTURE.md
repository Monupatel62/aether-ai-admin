# Architecture — aether-ai-admin

**Status:** Proposed logical architecture, not implemented.

## Boundary
Admin is a presentation and operator-workflow layer. It consumes authenticated, versioned APIs; it does not own identity, authorization policy, provider credentials, usage records, or domain persistence.

## Logical flow
1. An operator opens an admin route.
2. The server validates the session and resolves the principal through the auth contract.
3. The UI requests only the views/actions permitted for that principal.
4. The owning API/domain service re-authorizes each request against current policy and resource scope.
5. The domain service performs the operation and emits an auditable result.
6. Admin renders a sanitized result and correlation identifier.

## Dependencies
- aether-ai-web / shared UI components: visual primitives and accessibility patterns, subject to package boundaries.
- aether-ai-api: authenticated product/admin API boundary.
- aether-ai-auth: principal/session contract; not the sole resource authorization decision.
- aether-ai-security: shared security guidance and redaction conventions.
- aether-ai-observability: correlation and operational metadata where contracts are approved.

## Prohibited paths
- Browser directly calling provider control planes with privileged credentials.
- Admin bypassing API authorization through direct database access.
- Trusting role claims without current resource/action authorization.
- Import cycles from shared packages into the admin application.

## Deployment note
Repository boundaries do not mandate a standalone service. Deployment topology remains an architecture decision.
