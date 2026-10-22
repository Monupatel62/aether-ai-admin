# Aether AI Admin

**Status:** Documentation foundation only. No application implementation or deployment is claimed.

Privileged operator interface for model/provider configuration, user administration, policy review, quota visibility, and system health. The UI is not an authorization authority: every privileged operation must be authorized by the owning API/domain boundary.

## Documentation
- [Project specification](docs/PROJECT_SPEC.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Technical design](docs/TECHNICAL_DESIGN.md)
- [Dependencies and contracts](docs/DEPENDENCIES_AND_CONTRACTS.md)
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Security review](docs/SECURITY_REVIEW.md)
- [Research and licenses](docs/RESEARCH_AND_LICENSES.md)
- [Engineering standard](docs/ENGINEERING_STANDARD.md)
- [Work log](docs/WORKLOG.md)

## Guardrails
- Deny access by default; enforce authorization server-side on every operation.
- Require explicit confirmation for destructive or high-impact changes.
- Never expose provider secrets in the browser, logs, URLs, or audit displays.
- Do not access another repository's private database tables.
- This repository does not imply a separately deployed service.
