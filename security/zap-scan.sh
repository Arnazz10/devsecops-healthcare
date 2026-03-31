#!/bin/bash
TARGET_URL=$1

if [ -z "$TARGET_URL" ]; then
    echo "Usage: $0 <target-url>"
    exit 1
fi

echo "Starting OWASP ZAP Baseline Scan for: $TARGET_URL"
# Run ZAP baseline scan (using Docker)
docker run --rm -t owasp/zap2docker-stable zap-baseline.py -t "$TARGET_URL" -r zap_report.html

# Note: In a real CI/CD, we'd copy the report out
