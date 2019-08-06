ARG NODE_VERSION=12.7.0
FROM node:${NODE_VERSION}

ARG NODE_ENV=production
ENV PORT=3000 NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
COPY package.json package-lock.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

EXPOSE 3000

CMD [ "node", "app.js" ]
