# Use a Node.js base image suitable for development
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and lock file to leverage Docker cache
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# The command to run the development server will be provided by docker-compose.
# This CMD is a fallback for running the container directly.
CMD ["npm", "run", "dev"]