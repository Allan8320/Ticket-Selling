pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS_ID = 'docker-hub-credentials'
    }

    stages {

        stage('Build Docker') {
            steps {
                sh 'docker build -t ticket-app .'
            }
        }

        stage('Push Docker') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: DOCKER_HUB_CREDENTIALS_ID,
                    passwordVariable: 'DOCKER_PASS',
                    usernameVariable: 'DOCKER_USER'
                )]) {

                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker tag ticket-app allanpaul/smart-ticket-app:latest'
                    sh 'docker push allanpaul/smart-ticket-app:latest'
                }
            }
        }

        stage('Deploy to K8s') {
            steps {
                sh 'kubectl apply -f k8s/deployment.yaml'
                sh 'kubectl apply -f k8s/service.yaml'
            }
        }
    }
}