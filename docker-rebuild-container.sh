#!/bin/sh

# Remove outdated container and image
docker container stop fountain
docker container rm fountain
docker image rm $(podman image ls | grep fountain | awk '{print $3}')

# Build new image
docker build -t fountain .

# Run new container
docker run -dt -p 3000:3000 --name fountain -d fountain