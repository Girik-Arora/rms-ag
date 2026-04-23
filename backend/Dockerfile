# ─────────────────────────────────────────────
# RMS·AG — Multi-stage Docker build
# Stage 1: Build the Spring Boot JAR with Maven
# Stage 2: Run it with a slim JRE 21 image
# ─────────────────────────────────────────────

# ── Stage 1: Build ────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper + pom first (layer caching)
COPY pom.xml ./
COPY src ./src

# Package without running tests (tests need DB)
RUN apk add --no-cache maven && \
    mvn package -DskipTests -q

# ── Stage 2: Run ──────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built JAR from stage 1
COPY --from=builder /app/target/*.jar app.jar

# Expose the port Railway will use
EXPOSE 8082

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8082/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
