# ─────────────────────────────────────────────
# RMS·AG — Multi-stage Docker build
# Stage 1: Build the Spring Boot JAR with Maven
# Stage 2: Run it with a slim JRE 21 image
# ─────────────────────────────────────────────

# ── Stage 1: Build ────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

COPY pom.xml ./
COPY src ./src

RUN apk add --no-cache maven && \
    mvn package -DskipTests -q

# ── Stage 2: Run ──────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

# Render/Railway inject PORT dynamically — expose it
EXPOSE 8082

# Pass PORT env var into Spring Boot via system property
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8082} -jar app.jar"]
