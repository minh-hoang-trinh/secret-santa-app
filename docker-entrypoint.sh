#!/bin/bash
(npx prisma migrate dev --schema=./prisma/schema.prisma && npx ts-node --compiler-options {\"module\":\"CommonJS\"} ./prisma/seed.ts) || exit 1

exec "$@"