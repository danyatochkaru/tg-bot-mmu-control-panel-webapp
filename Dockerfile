FROM node:lts-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN npx prisma db push
EXPOSE 3000
CMD ["yarn", "dev"]
