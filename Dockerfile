FROM node:16.5-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install pm2 -g
# If you are building your code for production
# RUN npm ci --only=production
RUN apt-get update && apt-get install -y python3-pip
RUN pip3 install pandas python-shell mysql-connector-python openpyxl nested-lookup
# Bundle app source
COPY . .

EXPOSE 4000

CMD [ "npm", "run", "pm2" ]