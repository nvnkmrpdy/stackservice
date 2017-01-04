#!/bin/bash

# Repository
if [ ! -d "stackservice" ]; then
	# Clone the repository if it doesn't already exist
	echo "Cloning the stackservice repository from git hub..."
	git clone https://github.com/nvnkmrpdy/stackservice.git
	echo "Repository stackservice cloned from git hub"
	# cd into the parent directory
	cd stackservice
 else
	# cd into the parent directory
	cd stackservice
	# Pull the changes
	echo "Pulling the changes from the repository..."
	git pull
fi

# Build and package the project
echo "Building the stackservice app..."
docker run -it --rm -v "$PWD":/app -w /app maven:3.3-jdk-8 mvn clean install

# Build the Dockerfile
echo "Invoking the Dockerfile..."
docker build -f Dockerfile -t tomcat:8 .

# Run the application
echo "Starting the Tomcat server..."
docker run --rm -p 8080:8080 tomcat:8