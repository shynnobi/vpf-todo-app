# Use the same base image specified in the original devcontainer.json
FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye

# Install system dependencies required for Playwright browsers
# Combine all dependencies found during troubleshooting
RUN sudo apt-get update && sudo apt-get install -y \
    # Initial set from first attempt
    libnss3 libnspr4 libdbus-1-3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxkbcommon0 libatspi2.0-0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 \
    # Second set from second attempt
    libx11-xcb1 libxcursor1 libgtk-3-0 \
    # Third set (likely for WebKit) from third attempt
    libwoff1 libopus0 flite \
    # Clean up apt lists to reduce image size
    && sudo rm -rf /var/lib/apt/lists/*

# We can add package installations (like gh CLI) here later if needed
# For now, rely on features in devcontainer.json or manual installation
