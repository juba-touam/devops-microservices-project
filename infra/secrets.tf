locals {
  secret_names = ["ec2_host", "ec2_user", "ec2_ssh_key", "dockerhub_username", "dockerhub_token"]
}

resource "aws_secretsmanager_secret" "secrets" {
  for_each = toset(local.secret_names)
  name     = "microservices/${var.environment}/${each.key}"

  tags = {
    Environment = var.environment
    Project     = "microservices"
  }
}
