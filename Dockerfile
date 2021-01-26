#STEP 1 CREACION PROYECTO
FROM node:14-buster AS build
# Create app directory
WORKDIR /app
COPY package.json ./
# RUN npm install -g yarn
RUN yarn install
COPY . ./

EXPOSE 4000
CMD [ "node", "src/index.js" ]