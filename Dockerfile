FROM node:16.0.0

WORKDIR /usr/src/app

# RUN npm install -g yarn

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 4000

#Build to project
RUN yarn run build

# Run node server
CMD yarn run start
