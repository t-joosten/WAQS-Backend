# Get smallest possible Linux variant to run Node Server.
FROM node:11-alpine

# Add Git to pull TTN module.
RUN apk add --no-cache bash git

# Create a directory to save the API in.
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Copy default env variables, so it can be used immediately after pulling from the repository.
COPY .env.example .env

# Install dependancies to Alpine
RUN npm install

# Copy folder
COPY . .

# Expose the port to allow communication to flow through.
EXPOSE 4010

# Start the server
CMD ["npm", "start"]