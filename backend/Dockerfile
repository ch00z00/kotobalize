# Builder stage
FROM golang:1.23-alpine AS build

WORKDIR /app

COPY generated-server/go.sum .
COPY generated-server/go.mod .

RUN go mod download

COPY generated-server/ .

ENV CGO_ENABLED=0
RUN go build -o /app/main .

# Runtime stage
FROM alpine:3.18
ENV GIN_MODE=release
WORKDIR /app
COPY --from=build /app/main .
EXPOSE 8080/tcp
CMD ["./main"]
