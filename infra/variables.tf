variable "aws_region" {
  description = "AWS region for the infrastructure"
  type        = string
  default     = "eu-west-3"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.small"
}

variable "key_name" {
  description = "Name of the AWS key pair for SSH access"
  type        = string
}
