provider "local" {}

# Step 1: Setup environment
resource "null_resource" "setup_env" {
  provisioner "local-exec" {
    command = "echo Setting up environment..."
  }
}

# Step 2: Build Docker image
resource "null_resource" "docker_build" {
  provisioner "local-exec" {
    command = "docker build -t ticket-app .."
  }

  depends_on = [null_resource.setup_env]
}

# Step 3: Run Docker container
resource "null_resource" "docker_run" {
  provisioner "local-exec" {
    command = "docker run -d -p 3000:3000 ticket-app"
  }

  depends_on = [null_resource.docker_build]
}

# Step 4: Deploy to Kubernetes
resource "null_resource" "k8s_deploy" {
  provisioner "local-exec" {
    command = "kubectl apply -f ../k8s/"
  }

  depends_on = [null_resource.docker_run]
}
