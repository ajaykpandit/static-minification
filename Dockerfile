FROM node:alpine

# Select passed environment from argument
ARG env

WORKDIR /app

COPY package.json .
RUN npm install
COPY . .
COPY .env.${env} .env

CMD ["npm", "start"]
