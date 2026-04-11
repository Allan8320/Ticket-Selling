pipeline {
    agent any

    environment {
        // Automatically inject Docker Hub credentials stored in Jenkins
        DOCKER_HUB_CREDENTIALS_ID = 'docker-hub-credentials' 
    }

    stages {
        stage('Clone') {
            steps {
                // Pointing to your specific GitHub repository
                git 'https://github.com/Allan8320/Ticket-Selling.git'
            }
        }

        stage('Install') {
            steps {
                // Ensure dependencies are installed
                sh 'cd backend && npm install'
            }
        }

        stage('Build Docker') {
            steps {
                // Build the image locally in the Jenkins worker
                sh 'docker build -t ticket-app .'
            }
        }

        stage('Push Docker') {
            steps {
                // Securely login to Docker hub using the Jenkins Credentials
                withCredentials([usernamePassword(credentialsId: DOCKER_HUB_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                    
                    // Tag and push as your user 'allanpaul'
                    sh 'docker tag ticket-app allanpaul/smart-ticket-app:latest'
                    sh 'docker push allanpaul/smart-ticket-app:latest'
                }
            }
        }

        stage('Deploy to K8s') {
            steps {
                // Apply the deployment configurations from the 'k8s' folder
                sh 'kubectl apply -f k8s/deployment.yaml'
                sh 'kubectl apply -f k8s/service.yaml'
            }
        }
    }
}
