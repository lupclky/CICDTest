variable "aws_region" {
  description = "The AWS region to create resources in."
  default     = "ap-southeast-1"
}

variable "instance_type_server1" {
  description = "The type of instance for Server 1 (CI/CD)."
  default     = "t2.micro"
}

variable "instance_type_server2" {
  description = "The type of instance for Server 2 (App)."
  default     = "t2.micro"
}

variable "key_name" {
  description = "The name of the AWS key pair to use for SSH access."
  default     = "devops-cicd-key" # Key pair for CI/CD deployment
}

variable "private_key_path" {
  description = "The local path to the private key file (.pem) for SSH access."
  default     = "./devops-cicd-key.pem" # Private key file for EC2 access
}
