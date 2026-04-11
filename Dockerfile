# Use official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy backend and frontend source code
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Expose the port the app runs on
EXPOSE 3000

# Command to run the backend server
CMD ["node", "backend/server.js"]
