FROM node:7

WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/package.json
RUN npm install --unsafe-perm
RUN npm cache clean

COPY . /usr/src/app

RUN npm run build
CMD ["npm", "start"]
