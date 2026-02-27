FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Porta padrão do Expo Metro/Web
EXPOSE 8081
EXPOSE 19006

CMD ["npx", "expo", "start", "--web", "--port", "8081"]
