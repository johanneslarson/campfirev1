FROM rust:1.75-slim as builder

WORKDIR /usr/src/app
COPY . .

# Build the application
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install SSL certificates
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/local/bin
COPY --from=builder /usr/src/app/target/release/campfire-backend .
COPY --from=builder /usr/src/app/assets ./assets

# Expose the port
EXPOSE 8081

# Run the binary
CMD ["./campfire-backend"] 