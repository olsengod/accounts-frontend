FROM node:alpine

MAINTAINER LLC CERERIS <software@cereris.org>

COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["sh", "-c", "npm run start"]