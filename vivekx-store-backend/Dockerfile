# ==========================================
# STAGE 1: BUILD JAR FILE
# ==========================================
FROM maven:3.8.5-openjdk-17 AS builder
WORKDIR /app
COPY pom.xml .
# cache maven dependencies
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# STAGE 2: LIGHTWEIGHT RUNTIME IMAGE
# ==========================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/myfirstAppp-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]