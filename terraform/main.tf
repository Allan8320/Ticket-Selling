terraform {
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.1"
    }
  }
}

provider "local" {}

# This resource simulates creating "infrastructure" locally
# In a real cloud environment (AWS/Azure), you would use aws_instance or azurerm_virtual_machine
resource "local_file" "k8s_dummy_infrastructure" {
  filename = "${path.module}/infrastructure-details.txt"
  content  = <<-EOT
    Infrastructure Provisioning Complete!
    Environment: Local
    Resource: Dummy Local Kubernetes Node
    Creation Time: ${timestamp()}
    App: Smart Ticket Resale and Booking System
  EOT
}

# Output variables give useful information after terraform apply
output "infrastructure_status" {
  value = "Infrastructure successfully provisioned for the Smart Ticket System."
}
