# server/Dockerfile
FROM node:20

WORKDIR /app

# Copy and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the app code
COPY . .

# Expose port for the server
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]