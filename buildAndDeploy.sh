#!/bin/bash

# Clone the repository
git clone https://github.com/nvnkmrpdy/stackservice.git

# cd into the parent directory
cd stackservice

# Build and package the project
docker run -it --rm -v "$PWD":/app -w /app demo/maven:3.3-jdk-8 mvn clean install

# Build the Dockerfile
docker build -f Dockerfile -t demo/tomcat:8

# Run the application
docker run --rm -p 8080:8080 demo/tomcat:8