FROM node:alpine

MAINTAINER LLC CERERIS <software@cereris.org>

COPY package.json ./
RUN npm install --only=production
COPY . .
ENV NODE_ENV production
RUN npm run build
CMD ["sh", "-c", "npm run start"]
