FROM node:14.18-alpine

RUN apk add g++ make python3

# Select passed environment from argument
ARG env

#ENV NODE_ENV=production

WORKDIR /app

ENV SWAGGER_JSON=/usr/src/app/postman/schemas/schema.json

COPY . .

COPY .env.${env} .env

RUN npm install -g npm@latest

RUN npm install

EXPOSE 80

CMD ["npm", "start"]
