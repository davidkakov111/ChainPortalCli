# Stage 1: Build the Angular app
FROM node:latest AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Angular project
RUN npm run build --prod

# Stage 2: Serve the Angular app with Nginx
FROM nginx:alpine

# Copy the Angular build to the Nginx html folder
COPY --from=build /app/dist/chain-portal/browser /usr/share/nginx/html

# Expose the port for Nginx
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

# To remove containers, volumes, etc., run the following command:
# sudo docker compose down --volumes --rmi all
# To list volumes, use the following command by changing the word "volume":
# sudo docker volume ls
