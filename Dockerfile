FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy application code
COPY . .

# Expose application port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
