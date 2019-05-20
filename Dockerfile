FROM node:alpine

ARG IS_DEV

MAINTAINER LLC CERERIS <software@cereris.org>

COPY package.json ./
RUN npm install
COPY . .
ENV IS_DEV=$IS_DEV
ENV IS_LOCAL=false
RUN npm run build
CMD ["sh", "-c", "npm run start"]