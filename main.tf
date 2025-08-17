provider "aws" {
  region = var.aws_region
}

data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_security_group" "ci_cd_sg" {
  name        = "ci-cd-sg"
  description = "Security group for CI/CD and App servers"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # For Jenkins
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # For App
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "server1_ci_cd" {
  ami           = data.aws_ami.amazon_linux_2023.id
  instance_type = var.instance_type_server1
  key_name      = var.key_name
  vpc_security_group_ids = [aws_security_group.ci_cd_sg.id]

  tags = {
    Name = "Server1-CICD"
  }

  # Provision the server using Ansible after it is created
  provisioner "local-exec" {
    command = <<EOT
      sleep 30 # Wait for SSH to be available
      ansible-playbook -i '${self.public_ip},' --private-key '${var.private_key_path}' --user 'ec2-user' setup_cicd_server.yml
    EOT
  }
}

resource "aws_instance" "server2_app" {
  ami           = data.aws_ami.amazon_linux_2023.id
  instance_type = var.instance_type_server2
  key_name      = var.key_name
  vpc_security_group_ids = [aws_security_group.ci_cd_sg.id]

  tags = {
    Name = "Server2-App"
  }

  # Provision the server using Ansible after it is created
  provisioner "local-exec" {
    command = <<EOT
      sleep 30 # Wait for SSH to be available
      ansible-playbook -i '${self.public_ip},' --private-key '${var.private_key_path}' --user 'ec2-user' setup_app_server.yml
    EOT
  }
}
