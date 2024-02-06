FROM node:18.18.0-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18.18.0-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public/ /app/public/
COPY --from=builder /app/node_modules/ /app/node_modules/
COPY --from=builder /app/.next/ /app/.next/
COPY --from=builder /app/next-env.d.ts /app/
COPY --from=builder /app/next.config.js /app/

RUN ln -s .next _next

EXPOSE 3000

CMD ["npm", "start"]
