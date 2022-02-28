FROM node:17-alpine3.14

WORKDIR /usr/src/app
# Install deps
COPY ./package* ./
RUN npm install && \
    npm cache clean --force
COPY . .
# Expose ports (for orchestrators and dynamic reverse proxies)
EXPOSE 3000
# Start the app
CMD npm start
