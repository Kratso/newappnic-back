FROM node:17

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --legacy-peer-dependencies
# If you are building your code for production
# RUN npm ci --only=production

RUN npm install pm2 -g
RUN pm2 install typescript

# Bundle app source
COPY . .

EXPOSE 9955

CMD [ "pm2-runtime", "src/app.ts" ]