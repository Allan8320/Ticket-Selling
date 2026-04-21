
# 🧪 Q6: Kubernetes (kubectl Basics)

## Create Deployment

```bash
kubectl create deployment myapp --image=nginx:latest
kubectl get deployments
kubectl get pods
```

## Scale

```bash
kubectl scale deployment myapp --replicas=3
kubectl scale deployment myapp --replicas=1
```

## Expose & Debug

```bash
kubectl expose deployment myapp --port=80 --type=NodePort
kubectl get services
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

## Cleanup

```bash
kubectl delete deployment myapp
kubectl delete service myapp
```

---

# 🧪 Q7: GitHub Actions (Auto Build & Push with Buildx)

```yaml
name: Docker Build & Push

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  docker:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and Push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/python-app:latest
```

---

# 🧪 Q8: Containerise Flask App (No Push)

```bash
docker build -t flask-container .
docker run -d -p 5000:5000 --name myflask flask-container
docker ps
```

---

# 🧪 Q9: Clone, Modify & Push

```bash
git clone https://github.com/<username>/<repo-name>.git
cd <repo-name>

echo "Updated content" >> README.md
git add README.md
git commit -m "docs: update README"
git push origin main
```

---

# 🧪 Q10: GitHub Actions (Python Build & Test)

## app.py

```python
def add(a, b):
    return a + b


def greet(name):
    return f"Hello, {name}!"
```

## test_app.py

```python
from app import add, greet


def test_add():
    assert add(2, 3) == 5


def test_greet():
    assert greet("World") == "Hello, World!"
```

## requirements.txt

```
pytest
```

## Workflow

```yaml
name: Python Build & Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install Dependencies
        run: pip install -r requirements.txt

      - name: Run Tests
        run: pytest test_app.py -v
