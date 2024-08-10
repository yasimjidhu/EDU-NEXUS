# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./

RUN npm install --legacy-peer-deps

# Copy the rest of the application  
COPY . .

# Expose the port that the app runs on
EXPOSE 5173

# Start the application in development mode
CMD ["npm", "run", "dev"]
