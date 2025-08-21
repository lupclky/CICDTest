#!/bin/bash
echo "🚀 Setting up Application Server..."

# Update system
sudo dnf update -y

# Install Docker
sudo dnf install -y docker

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add ec2-user to docker group
sudo usermod -aG docker ec2-user

echo "✅ Server 2 setup completed!"
echo "🐳 Docker is ready for deployments"

