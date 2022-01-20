FROM node:16.13-buster-slim as build-step

RUN mkdir -p /app
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY ./src ./src
COPY ./public ./public

RUN npm run build

FROM nginx:stable-alpine
COPY --from=build-step /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080 8443
CMD ["nginx" "-g" "daemon off;"]
