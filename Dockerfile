# Node 22 base image
FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy project files
COPY . .

# Build frontend production bundle
RUN npm run build

# Expose port (default 3000)
ENV PORT=3000
EXPOSE 3000

# Start server
CMD ["npm", "start"]
