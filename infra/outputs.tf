output "environment" {
  description = "Current environment name"
  value       = var.environment
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.microservices.public_ip
}

output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.microservices.id
}

output "instance_public_dns" {
  description = "Public DNS of the EC2 instance"
  value       = aws_instance.microservices.public_dns
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "github_actions_role_arn" {
  description = "ARN of the IAM role for GitHub Actions OIDC"
  value       = aws_iam_role.github_actions.arn
}
