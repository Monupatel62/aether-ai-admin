# Research and Licenses — aether-ai-admin

**Status:** Research register; no dependency has been selected or approved.

## Candidate references
- Aether AI master catalog and architecture documents.
- Existing aether-ai-web and aether-ai-ui-components contracts for design-system alignment.
- aether-ai-api, aether-ai-auth, and aether-ai-security contracts for server-side permissions and session behavior.
- OWASP guidance for access control, session management, XSS, CSRF, and secure logging.
- WCAG 2.2 guidance for accessible administrative workflows.

## Evaluation rules
- Prefer existing approved shared components over duplicated UI frameworks.
- Check current release, maintenance status, license, transitive dependencies, security advisories, and compatibility before adoption.
- Preserve required license notices and record attribution.
- Do not copy external implementation code without file-level license review.
- Do not introduce a new identity, policy, audit, or secret-management authority in the admin UI.

## Open research
- Final admin API routes and schema versioning.
- Operator role boundaries and whether tenant administrators see this product surface.
- Audit export authorization, retention, and redaction policy.
- Accessibility and browser support requirements.

These references guide evaluation; they do not certify legal compliance or imply implementation.
