# Use the official Node.js 18 image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the .npmrc file to handle legacy-peer-deps during installation
COPY .npmrc .npmrc

# Copy package.json and package-lock.json to leverage Docker caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project directory (excluding ignored files from .dockerignore)
COPY . .

# If .env.local exists, ensure it’s copied (or handle via runtime mounting)
COPY .env.local .env.local

# Build the Next.js application
RUN npm run build

# Expose the app's port
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "run", "start"]
