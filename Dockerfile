FROM node:lts-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
VOLUME ./src /app/src
EXPOSE 3000
CMD ["yarn", "dev"]
