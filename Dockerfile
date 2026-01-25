ARG nginxVersion=1.23.2
ARG alpineVersion=3.19
ARG nodeVersion=20

# build environment
FROM node:${nodeVersion}-alpine${alpineVersion} as buildStep
WORKDIR /app
COPY . .
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm install --legacy-peer-deps
RUN npm run build

# production environment
FROM nginx:${nginxVersion}
WORKDIR /data/www
RUN rm -rf ./*
COPY --from=buildStep /app/build .
COPY --from=buildStep /app/nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]


