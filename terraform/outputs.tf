output "instance_id" {
  value = aws_instance.bank_api.id
}

output "public_ip" {
  value = aws_instance.bank_api.public_ip
}

output "public_dns" {
  value = aws_instance.bank_api.public_dns
}

output "ssh_command" {
  value = "ssh -i PATH_TO_KEY ubuntu@${aws_instance.bank_api.public_ip}"
}

output "health_url" {
  value = "http://${aws_instance.bank_api.public_ip}:${var.application_port}/actuator/health"
}
