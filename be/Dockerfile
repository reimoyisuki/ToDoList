# Use Node.js Alpine base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port
EXPOSE 4000

# Start the application
CMD ["node", "index.js"]

# Start the application
CMD ["npm", "start"]
