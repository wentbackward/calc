# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Install Expo CLI globally
RUN npm install -g expo-cli

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the Expo development server port
EXPOSE 19000 19001 19002

# Start Expo
CMD ["expo", "start", "--tunnel"]
