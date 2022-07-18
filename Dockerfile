FROM node:14.17.1-alpine

ENV TZ=Europe/Moscow

WORKDIR /app

COPY . .

RUN yarn && yarn postinstall

CMD ["yarn", "start:stage"]
