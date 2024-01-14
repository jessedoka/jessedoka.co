# Use the official Node.js image as the base image
FROM node:21-alpine3.18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the port that Next.js uses (default is 3000)
EXPOSE 3000

# Run the Next.js application
CMD ["yarn", "dev"]
