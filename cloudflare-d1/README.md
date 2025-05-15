Cloudflare Workers + D1 example
===============================

## How to migrate

```
# generate migration files
bunx drizzle-kit generate

# apply migration files in local
bunx wrangler d1 migrations apply <DATABASE_NAME> --local

# apply migration files in remote
bunx wrangler d1 migrations apply <DATABASE_NAME> --remote
```
