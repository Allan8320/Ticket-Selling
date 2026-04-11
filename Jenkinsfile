pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS_ID = 'docker-hub-credentials' // You need to set this up in Jenkins
        DOCKER_IMAGE = 'allanpaul/smart-ticket-app'
        DOCKER_TAG = 'latest'
    }

    stages {
        stage('Clone Repository') {
            steps {
                // In a real scenario, this would point to your Git repo.
                // Assuming Jenkins is scanning the repo directly:
                echo 'Cloning the Smart Ticket Repository...'
                checkout scm
            }
        }

        stage('Install Dependencies & Test') {
            steps {
                dir('backend') {
                    echo 'Installing Backend Node.js Dependencies...'
                    // We mock standard tests here
                    sh 'npm install'
                    echo 'Running tests... (MOCK)'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker Image...'
                // Build complete frontend/backend docker image
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing image to Docker Hub...'
                withCredentials([usernamePassword(credentialsId: DOCKER_HUB_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                    sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying to Local Kubernetes Cluster...'
                // Apply K8s configuration. Requires kubectl configured in Jenkins
                sh "kubectl apply -f k8s/deployment.yaml"
                sh "kubectl apply -f k8s/service.yaml"
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully! Smart Ticket App is Live!'
        }
        failure {
            echo 'Pipeline execution failed. Please check the logs.'
        }
    }
}
