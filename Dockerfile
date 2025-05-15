# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

# https://medium.com/@pierre.fourny/optimized-docker-setup-for-vite-powered-react-apps-e7b7f5a82bb4
# https://labs.iximiuz.com/tutorials/docker-multi-stage-builds

ARG NODE_VERSION=22

################################################################################
# Use node image for base image for all stages.

# Lifehack: Define the Node.js image only once for all stages.
# Generally, it's a good idea to stick with the active LTS version.
FROM node:${NODE_VERSION}-slim AS base


################################################################################
# Create a stage for installing production (and dev?) dependencies.

# Optimization: Re-install dependencies only when
# package.json or package-lock.json files change.
FROM base AS deps

# Set working directory for all build stages.
WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    # npm ci --omit=dev
    npm ci 

################################################################################
# Run tests right in the container reusing the installed dependencies.
FROM deps AS test
WORKDIR /usr/src/app
COPY . .
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm run test


################################################################################
# Create a stage for building the application.
FROM base AS build

WORKDIR /usr/src/app

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
# RUN --mount=type=bind,source=package.json,target=package.json \
#     --mount=type=bind,source=package-lock.json,target=package-lock.json \
#     --mount=type=cache,target=/root/.npm \
#     npm ci

# IMPORTANT: Add node_modules to your .dockerignore file
# to avoid overwriting the node_modules from the deps stage.
COPY --from=deps /usr/src/app/node_modules ./node_modules
# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
# Runtime stage
FROM nginx:alpine
# WORKDIR /usr/share/nginx/html

# RUN rm -rf ./*
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist /var/www/html/
# COPY --from=build /usr/src/app/dist .

EXPOSE 3000

ENTRYPOINT ["nginx", "-g", "daemon off;"]
