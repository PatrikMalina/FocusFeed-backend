# Include the latest node image
FROM node:lts

# Aliases setup for container folders
ARG SERVER="/slek-server"
ARG SERVER_src="."
ARG BUILD="/slek-server/build"

# Define environment variables for server (see .env)
ENV PORT=3333
ENV HOST=0.0.0.0
ENV NODE_ENV=development
ENV APP_KEY=L-gfsM2eG-mtThy05pr7MA4UZoo6V4Nn
ENV DRIVE_DISK=local
ENV DB_CONNECTION=pg
ENV PG_HOST=host.docker.internal
ENV PG_PORT=5432
ENV PG_USER=slack2
ENV PG_PASSWORD=admin
ENV PG_DB_NAME=chatApp

# Set the working directory inside the container to server module
WORKDIR ${SERVER}

# Expose port outside container
EXPOSE ${PORT}

# Copy server module
COPY ${SERVER_src} ${SERVER}
RUN npm install
# Build TS files
RUN node ace build --production --ignore-ts-errors

# Update workdir
WORKDIR ${BUILD}

# Install production dependencies
RUN npm ci --production 

# Start server module inside the container
CMD ["node", "server.js"]