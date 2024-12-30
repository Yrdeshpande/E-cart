# client/Dockerfile
FROM node:20

WORKDIR /start

# Copy and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the app code
COPY . .

# Expose port for the server
EXPOSE 3000

# Start the client
CMD [ "npm", "start" ]