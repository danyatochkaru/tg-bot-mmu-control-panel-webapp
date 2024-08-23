FROM node:lts-alpine
WORKDIR /app
RUN apk add --no-cache alpine-conf && \
    setup-timezone -z Europe/Moscow
RUN corepack enable
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn set version berry
RUN yarn
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["yarn", "dev"]
