#!/bin/sh

# Remove outdated container and image
podman container stop fountain
podman container rm fountain
podman image rm $(podman image ls | grep fountain | awk '{print $3}')

# Build new image
podman build -t fountain .

# Run new container
podman run -dt -p 3000:3000 --name fountain -d fountain