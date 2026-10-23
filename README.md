# aether-ai-admin

**Status:** Initial structured audit-event service implemented on a feature branch. No production audit store or admin console is configured.

## Implemented

- [Audit service](src/index.js): required actor/tenant/action/resource/outcome metadata, severity validation, strict detail-key allowlist, bounded primitive detail values, and safe store-error handling.
- [Unit tests](test/admin.test.js): schema validation, secret/prompt field filtering, nested value rejection, and persistence failures.
- Dependency-free Node.js package with Node 20/22 CI.

## Limitations

The store adapter must provide durable, append-only semantics and access controls. This package does not provide audit search/export UI, tamper-evident storage, retention/legal-hold policy, privileged-action workflows, or production alerting. Audit events intentionally avoid arbitrary request bodies and user content.

## Documentation

- [Repository specification](docs/REPOSITORY_SPECIFICATION.md)
- [Project specification](docs/PROJECT_SPEC.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Dependencies and contracts](docs/DEPENDENCIES_AND_CONTRACTS.md)
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Security review](docs/SECURITY_REVIEW.md)
- [Master catalog](https://github.com/Monupatel62/aether-ai-platform/blob/main/docs/REPOSITORY_CATALOG.md)
