FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install compilers + runtimes
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    python3 \
    python3-pip \
    nodejs \
    npm \
    openjdk-17-jdk \
    time \
    && apt-get clean

WORKDIR /app

COPY runner.sh /runner.sh

RUN chmod +x /runner.sh

CMD ["bash"]