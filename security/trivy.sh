#!/bin/bash
IMAGE_NAME=$1

if [ -z "$IMAGE_NAME" ]; then
    echo "Usage: $0 <image-name>"
    exit 1
fi

echo "Scanning image: $IMAGE_NAME"
# Run Trivy and fail if HIGH or CRITICAL vulnerabilities are found
trivy image --exit-code 1 --severity HIGH,CRITICAL "$IMAGE_NAME"
