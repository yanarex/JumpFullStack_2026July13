variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "us-east-1"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type"
  default     = "t2.micro"
}

variable "key_name" {
  type        = string
  description = "Name of an existing EC2 key pair"
}

variable "ssh_cidr" {
  type        = string
  description = "Your public IPv4 address with /32"

  validation {
    condition     = can(cidrhost(var.ssh_cidr, 0))
    error_message = "Use a valid CIDR such as 203.0.113.10/32."
  }
}

variable "application_port" {
  type        = number
  description = "Spring Boot port"
  default     = 8080
}

variable "project_name" {
  type        = string
  description = "Resource name prefix"
  default     = "bank-api"
}
