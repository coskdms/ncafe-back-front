# Build stage
FROM gradle:8.10.2-jdk21 AS builder
WORKDIR /app
COPY . .
RUN chmod +x ./gradlew
# 백엔드 프로젝트 빌드 (gradle-wrapper.properties의 버전을 맞추거나 다운로드 무시를 위해 빌드 시도)
RUN ./gradlew :backend:bootJar --no-daemon -x test

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# 시간대 설정을 위한 tzdata 설치 및 설정
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone
COPY --from=builder /app/backend/build/libs/*.jar app.jar
ENV TZ=Asia/Seoul
EXPOSE 8032
RUN mkdir -p /app/upload
VOLUME /app/upload
ENTRYPOINT ["java", "-jar", "app.jar"]
