FROM node:alpine

ARG NODE_ENV

MAINTAINER LLC CERERIS <software@cereris.org>

COPY package.json ./
RUN npm install
COPY . .
ENV NODE_ENV=$NODE_ENV
RUN npm run build
CMD ["sh", "-c", "npm run start"]
