# 🚀 End Semester Practical – DevOps Lab

**Department of Computer Science & Engineering**
**Karunya Institute of Technology and Sciences**

---

## 📌 Lab Setup Requirements

* Git
* Python 3.11+
* pip
* Docker Engine
* Jenkins (via Docker)
* kubectl + Minikube
* GitHub Account
* Docker Hub Account

---

# 🧪 Q1: Git Operations & Pull Request

## Initialize Repository

```bash
git init myproject
cd myproject

echo "# My DevOps Project" > README.md
git add README.md
git commit -m "Initial commit: add README"
```

## Create Feature Branch

```bash
git checkout -b feature/hello

echo "Hello from feature branch" > hello.txt
git add hello.txt
git commit -m "feat: add hello.txt"
```

## Push & Create PR

```bash
git remote add origin https://github.com/<username>/myproject.git
git push -u origin feature/hello
```

➡️ Go to GitHub → Create Pull Request → Merge

## Merge Branch

```bash
git checkout main
git merge feature/hello
git push origin main
git log --oneline --graph
```

---

# 🧪 Q2: Dockerise Flask App & Push to Docker Hub

## app.py

```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def home():
    return "Hello from Dockerised Flask!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

## requirements.txt

```
flask
```

## Dockerfile

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

## Build, Run & Push

```bash
docker build -t <dockerhub-username>/flask-app:latest .
docker run -d -p 5000:5000 <dockerhub-username>/flask-app:latest

docker login
docker push <dockerhub-username>/flask-app:latest
```

---

# 🧪 Q3: Monolithic Flask Application (Student CRUD)

```python
from flask import Flask, request, jsonify

app = Flask(__name__)
students = {}
next_id = 1

@app.route('/students', methods=['GET'])
def get_students():
    return jsonify(list(students.values()))

@app.route('/students', methods=['POST'])
def add_student():
    global next_id
    data = request.get_json()
    student = {'id': next_id, 'name': data['name'], 'roll': data['roll']}
    students[next_id] = student
    next_id += 1
    return jsonify(student), 201

@app.route('/students/<int:sid>', methods=['DELETE'])
def delete_student(sid):
    students.pop(sid, None)
    return jsonify({'msg': 'Deleted'})

if __name__ == '__main__':
    app.run(debug=True)
```

## Run

```bash
pip install flask
python app.py
```

---

# 🧪 Q4: GitHub Actions CI (Build & Push Docker Image)

## Workflow File

`.github/workflows/docker-publish.yml`

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ main ]

jobs:
  build-push:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build Image
        run: docker build -t ${{ secrets.DOCKER_USERNAME }}/python-app:latest .

      - name: Push Image
        run: docker push ${{ secrets.DOCKER_USERNAME }}/python-app:latest
```

---

# 🧪 Q5: Jenkins Pipeline (Dockerized App)

## Run Jenkins Container

```bash
docker volume create jenkins-data

docker run -d \
  --name jenkins \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins-data:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```

## Install Docker inside Jenkins

```bash
docker exec -u root jenkins bash -c \
"apt-get update && apt-get install -y docker.io"
```

## Jenkinsfile

```groovy
pipeline {
    agent any

    environment {
        IMAGE_NAME = "myapp"
        DOCKER_HUB_USER = "<your-dockerhub-username>"
    }

    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/<username>/<repo>.git'
            }
        }

        stage('Build Image') {
            steps {
                sh 'docker build -t $DOCKER_HUB_USER/$IMAGE_NAME:latest .'
            }
        }

        stage('Push Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push $DOCKER_HUB_USER/$IMAGE_NAME:latest
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker run -d -p 5000:5000 $DOCKER_HUB_USER/$IMAGE_NAME:latest'
            }
        }
    }
}
```

---
