FROM golang:1.24-alpine AS build

WORKDIR /app

COPY go.sum .
COPY go.mod .

RUN go mod download

COPY . .

ENV CGO_ENABLED=0
RUN go build -o /app/main .

FROM alpine:3.18
ENV GIN_MODE=release
WORKDIR /app
COPY --from=build /app/main .
EXPOSE 8080/tcp
CMD ["./main"]
