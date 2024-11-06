FROM node:lts AS base

FROM base AS dependencies
WORKDIR /wkdir
COPY . .
RUN npm ci

FROM dependencies AS build
RUN npm run build:all

FROM base AS final

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev --ignore-scripts

COPY --from=build /wkdir/dist/apps/api /app/dist
COPY --from=build /wkdir/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /wkdir/apps/api/src/database/prisma /app/prisma
COPY --from=build /wkdir/dist/apps/web /app/dist/web

EXPOSE 3000

CMD ["node", "dist/main.js"]

COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]