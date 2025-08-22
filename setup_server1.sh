#!/bin/bash
echo "Setting up CI/CD Server..."

# Update system
sudo dnf update -y

# Install Java 17 for Jenkins
sudo dnf install -y java-17-amazon-corretto-devel

# Add Jenkins repository
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key

# Install Jenkins
sudo dnf install -y jenkins

# Install Docker, Git
sudo dnf install -y docker git

# Add Trivy repository
cat <<EOF | sudo tee /etc/yum.repos.d/trivy.repo
[trivy]
name=Trivy repository
baseurl=https://aquasecurity.github.io/trivy-repo/rpm/releases/\$basearch/
gpgcheck=1
enabled=1
gpgkey=https://aquasecurity.github.io/trivy-repo/rpm/public.key
EOF

# Install Trivy
sudo dnf install -y trivy

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add users to docker group
sudo usermod -aG docker ec2-user
sudo usermod -aG docker jenkins

# Start and enable Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Wait a bit for Jenkins to start
sleep 10

# Get Jenkins initial password
echo "Jenkins Initial Password:"
sudo cat /var/lib/jenkins/secrets/initialAdminPassword

echo "Server 1 setup completed!"
echo "Access Jenkins at: http://54.169.146.170:8080"

