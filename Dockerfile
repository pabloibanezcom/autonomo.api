FROM node:14
WORKDIR /usr/autonomo.api
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
ENV APP_PORT 8080
EXPOSE 8080
CMD [ "node", "./dist/index.js" ]