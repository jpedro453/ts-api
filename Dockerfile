FROM node:18
WORKDIR /usr/src/clean-ts-api
COPY ./package.json .
RUN npm install --only=prod
COPY ./dist ./dist
EXPOSE 3030
CMD npm start