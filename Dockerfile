FROM node:14 AS compile

WORKDIR /opt/ng
COPY package.json package-lock.json ./
RUN npm ci

ENV PATH="./node_modules/.bin:$PATH"

COPY . ./
RUN npm run build:ssr

FROM node:14-alpine as run
COPY --from=compile /opt/ng/dist/tobysmith-uk /dist/tobysmith-uk

EXPOSE 4000
CMD [ "node", "/dist/tobysmith-uk/server/main.js" ]
