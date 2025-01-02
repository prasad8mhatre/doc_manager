FROM node:22

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Expose the port
EXPOSE 80

# Build the app and serve it
RUN npm run build --prod
CMD ["npx", "http-server", "dist", "-p", "80"]
