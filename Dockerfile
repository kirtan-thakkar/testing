FROM mcr.microsoft.com/playwright/java:v1.41.0-jammy

WORKDIR /app

# Copy Maven configuration
COPY pom.xml .

# Download dependencies (this caches the dependencies layer)
RUN mvn dependency:go-offline || true

# Copy source code and logs folder
COPY src ./src
RUN mkdir -p logs

# Ensure playwright browsers are installed
RUN mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="install chromium"

# Default command to run tests
CMD ["mvn", "clean", "test"]
