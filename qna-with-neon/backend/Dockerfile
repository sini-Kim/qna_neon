# 1) 빌드 단계 (멀티스테이지 빌드)
FROM maven:3.9.4-eclipse-temurin-20 AS build

WORKDIR /app

# Maven 의존성 캐시를 위해 먼저 pom.xml 복사
COPY pom.xml .

# 의존성 다운로드 (캐시 활용)
RUN mvn dependency:go-offline

# 소스 코드 복사
COPY src ./src

# 패키징 (실행 가능한 JAR 생성)
RUN mvn package -DskipTests

# 2) 실행 단계
FROM eclipse-temurin:20-jre-alpine

WORKDIR /app

# 빌드 단계에서 생성된 JAR 파일 복사
COPY --from=build /app/target/*.jar app.jar

# Spring Boot가 0.0.0.0에서 리스닝하도록 설정 (기본값이지만 명시 가능)
ENV JAVA_OPTS="-Dserver.address=0.0.0.0"

# 컨테이너 외부에 노출할 포트 (Spring Boot 기본 8080)
EXPOSE 8080

# 애플리케이션 실행
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]