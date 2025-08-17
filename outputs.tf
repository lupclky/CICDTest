output "server1_public_ip" {
  value = aws_instance.server1_ci_cd.public_ip
  description = "Public IP address of Server 1 (CI/CD)"
}

output "server2_public_ip" {
  value = aws_instance.server2_app.public_ip
  description = "Public IP address of Server 2 (App)"
}
