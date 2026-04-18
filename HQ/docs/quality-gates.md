# Quality Gates

**Read this when:** Running `/deploy`, preparing a production push, or validating client UAT.

Adapted from SiteAudit's wave-based pipeline:

1. **Pre-deploy checks** — `npm run lint && npm run build && npm test`
2. **Code review** — `code-reviewer` agent scans changes
3. **Staging deploy** — Preview deployment on Vercel for client UAT
4. **Production promote** — Only after client approval on staging

Production deploys never bypass these gates. If a gate fails, fix the root cause — don't skip.
