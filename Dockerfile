FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json .

COPY yarn.lock .

COPY ecosystem.config.js .


RUN yarn install

RUN npm install pm2 -g 


COPY . .

RUN yarn build



RUN yarn db:migration

EXPOSE 4000

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
# CMD [ "yarn", "start" ]