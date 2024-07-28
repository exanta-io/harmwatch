FROM node:18

WORKDIR /frontend

COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]
