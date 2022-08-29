FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY index.js ./
COPY .babelrc ./
COPY src ./src
COPY node_modules ./node_modules

EXPOSE 3000
CMD ["yarn", "run", "start"]