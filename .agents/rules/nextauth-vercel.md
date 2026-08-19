---
description: Resolving NextAuth v5 Configuration errors on Vercel
---

# NextAuth v5 on Vercel

When deploying NextAuth v5 (Auth.js) on Vercel, it is prone to crashing with a `Configuration` error during boot.

**Rule:**
If the application is using `CredentialsProvider` and does not strictly require automatic database synchronization for OAuth providers, **DO NOT** use `PrismaAdapter` in the NextAuth configuration.

Using `PrismaAdapter` alongside `CredentialsProvider` on Vercel can cause synchronous database connection timeouts during the edge boot phase, which NextAuth catches and throws as a fatal `Configuration` error, locking users out. Always remove `PrismaAdapter` if only using `CredentialsProvider` and `session: { strategy: "jwt" }`.
