# Smart Ticket Resale and Booking System 🎟️

This is a complete end-to-end DevOps project integrating frontend, backend, containerization, orchestration, IaC, and CI/CD, aimed at SIH-based requirements. 

## 📂 Phase 7: Complete Project Structure
```text
smart-ticket-system/
├── backend/
│   ├── package.json      # Node.js dependencies
│   └── server.js         # Express backend with APIs & Static serve
├── frontend/
│   ├── app.js            # Fetch API logic
│   ├── index.html        # Main simple HTML Page
│   └── style.css         # Clean UI styling
├── Dockerfile            # Multi-stage image build
├── docker-compose.yml    # Local quick-run config
├── k8s/
│   ├── deployment.yaml   # K8s container deployment
│   └── service.yaml      # NodePort service exposure
├── terraform/
│   └── main.tf           # Infrastructure as code
├── ansible/
│   ├── inventory.ini     # Server listing
│   └── playbook.yml      # Configuration commands
├── Jenkinsfile           # CI/CD Pipeline steps
└── README.md             # This comprehensive guide
```

---

## 🛠️ Phase 8: Execution Commands (Step-by-Step)

### 1. Running Locally (Without Docker)
1. Ensure Node.js is installed.
2. Open terminal in `smart-ticket-system/backend/`
3. Run: `npm install`
4. Run: `node server.js`
5. Open browser at: `http://localhost:3000`

### 2. Docker Build & Run
1. Open terminal in `smart-ticket-system/`
2. Run: `docker build -t smart-ticket-app .`
3. Run: `docker run -d -p 3000:3000 --name ticket-app smart-ticket-app`
4. Open browser at: `http://localhost:3000`

*(Or simply use: `docker-compose up -d`)*

### 3. Terraform Apply (Infrastructure)
1. Install Terraform locally and navigate to `smart-ticket-system/terraform/`
2. Run: `terraform init`
3. Run: `terraform plan`
4. Run: `terraform apply` *(type `yes` when prompted)*

### 4. Ansible Run (Configuration)
1. Install Ansible (via WSL if on Windows) and navigate to `smart-ticket-system/ansible/`
2. Run: `ansible-playbook -i inventory.ini playbook.yml`

### 5. Kubernetes Deploy
1. Ensure Minikube / Docker Desktop (with Kubernetes enabled) is running.
2. Navigate to `smart-ticket-system/k8s/`
3. Run: `kubectl apply -f deployment.yaml`
4. Run: `kubectl apply -f service.yaml`
5. Check pods: `kubectl get pods`
6. Check services: `kubectl get services`
7. Access via Browser: `http://localhost:30000` *(Or find the Minikube IP: `minikube ip` and append `:30000`)*

### 6. Jenkins Pipeline Execution
1. Ensure Jenkins is running (e.g. `http://localhost:8080`)
2. Create a new Pipeline Item.
3. In Pipeline config, select "Pipeline script from SCM", put in your Git URL (after uploading this repo) or paste the contents of `Jenkinsfile` directly if running locally without a git host.
4. Click "Build Now".

---

## 🐛 Phase 9: Debugging Guide

### Node.js Errors
* **Error**: `Error: listen EADDRINUSE: address already in use :::3000`
  * **Fix**: Port 3000 is occupied. Stop the existing process using `npx kill-port 3000` or change the `PORT` in `server.js`.

### Docker Issues
* **Error**: `docker daemon is not running`
  * **Fix**: Ensure Docker Desktop is started and the whale icon is in your system tray.

### Kubernetes Pod Errors
* **Error**: `ImagePullBackOff`
  * **Fix**: Kubernetes can't find the image locally. Set `imagePullPolicy: Never`/`IfNotPresent` in `deployment.yaml` or push the image to Docker Hub using `docker push`.

### Jenkins Failures
* **Error**: `docker command not found` inside Jenkins
  * **Fix**: Jenkins user on your system needs permission to execute Docker commands. Add Jenkins to the docker group `sudo usermod -aG docker jenkins` and restart Jenkins.

---

## 🎓 Phase 10: Viva + Architecture

### Architecture Diagram (Text-Based)
```
[ User (Browser) ]
      ↓ 
[ K8s Service (NodePort: 30000) ]
      ↓
[ K8s Deployment (Pods) ]
      ↓
[ Docker Container (Node.js/Express) ]
      ↓ (Serves)
[ HTML / CSS / JS ] & [ API Routes ]
```

### Simple Explanation of Tools (For Viva)
1. **Node.js/Express**: The backend engine doing logic/math. Like the kitchen of a restaurant.
2. **HTML/CSS/JS**: The frontend UI. Like the dining area where customers sit and see things.
3. **Docker**: Packages the kitchen and dining area into one portable "box" that works exactly the same everywhere.
4. **Kubernetes (K8s)**: The manager that ensures at least 2 "boxes" are always running. If one crashes, it instantly starts a new one.
5. **Terraform**: Helps us automate exactly what computers/servers we need from the cloud instead of clicking manually in a website.
6. **Ansible**: Connects to those servers and automatically installs software (like Docker/Node) so we don't have to type commands inside the server.
7. **Jenkins**: The robot that listens to code changes. When we save new code, Jenkins automatically builds the Docker box and tells Kubernetes to run the new box.

### General Viva Questions
* **Q: Why use Docker when we have Node.js locally?**
  * **A:** "It works on my machine" syndrome. Docker guarantees the app works exactly the same on the developer's laptop, testing server, and production environment.
* **Q: Difference between Docker and Kubernetes?**
  * **A:** Docker creates the container (the ship). Kubernetes manages hundreds of those containers (the port manager), handling their health, scale, and networking.
* **Q: Why use Terraform instead of Ansible for server creation?**
  * **A:** Terraform manages *infrastructure* (creating the VMs, networks). Ansible manages *configuration* (installing software inside the VM after it is created).
