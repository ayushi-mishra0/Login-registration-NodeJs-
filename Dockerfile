# # Use an official Node.js runtime as a base image
# FROM node:14

# # Set the working directory inside the container
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install --only=production

# # Copy the rest of the application code
# COPY . .

# # Expose port 3000 to be accessible from outside the container
# EXPOSE 3000

# # Start the Node.js application
# CMD [ "node", "./bin/www" ]

# Use Ubuntu as the base image
FROM ubuntu:latest

# Update and install dependencies
RUN apt-get update && apt-get install -y curl

# Download Node.js setup script from NodeSource
RUN curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh

# Run the Node.js setup script to install Node.js and npm
RUN bash /tmp/nodesource_setup.sh && apt-get install -y nodejs

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json ./

# Install node modules
RUN npm install

# Copy the application files
COPY . .

# Expose the application port (if needed)
EXPOSE 9000

# Run the application
ENTRYPOINT ["node", "./bin/www"]
