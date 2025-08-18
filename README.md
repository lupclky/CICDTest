# 🚀 CI/CD Pipeline với Jenkins, Docker, Ansible và Terraform

## 📋 Mục lục
- [Tổng quan hệ thống](#-tổng-quan-hệ-thống)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Chuẩn bị](#-chuẩn-bị)
- [Cài đặt từng bước](#-cài-đặt-từng-bước)
- [Cấu hình Jenkins](#-cấu-hình-jenkins)
- [Triển khai ứng dụng](#-triển-khai-ứng-dụng)
- [Monitoring và Troubleshooting](#-monitoring-và-troubleshooting)
- [FAQ](#-faq)

## 🎯 Tổng quan hệ thống

Hệ thống CI/CD tự động bao gồm:
- **Server 1 (CI/CD)**: Jenkins, Docker, Ansible, Trivy
- **Server 2 (App)**: Docker runtime cho ứng dụng
- **GitHub**: Source code repository
- **Docker Hub**: Container registry
- **Terraform**: Infrastructure as Code

### 🏗️ Kiến trúc hệ thống
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   GitHub    │───▶│  Server 1   │───▶│  Server 2   │
│ (Source)    │    │  (CI/CD)    │    │   (App)     │
└─────────────┘    └─────────────┘    └─────────────┘
                           │                   │
                           ▼                   ▼
                   ┌─────────────┐    ┌─────────────┐
                   │ Docker Hub  │    │   Users     │
                   │ (Registry)  │    │ (Port 80)   │
                   └─────────────┘    └─────────────┘
```

## 💻 Yêu cầu hệ thống

### Máy local (Development):
- **OS**: Windows 10+, macOS 10.14+, hoặc Linux
- **Tools**:
  - Git
  - AWS CLI v2
  - Terraform >= 1.0
  - Ansible >= 2.9
  - SSH client
- **Accounts**:
  - AWS Account với IAM permissions
  - GitHub Account
  - Docker Hub Account

### AWS Resources:
- **2 EC2 instances**: t2.micro (Free Tier eligible)
- **Security Groups**: Ports 22, 80, 8080
- **Key Pair**: Để SSH vào instances

## 🛠 Chuẩn bị

### 1. Tạo AWS Key Pair
```bash
# Tạo key pair trên AWS Console
# Hoặc dùng CLI:
aws ec2 create-key-pair --key-name my-cicd-key --query 'KeyMaterial' --output text > my-cicd-key.pem
chmod 400 my-cicd-key.pem
```

### 2. Cấu hình AWS CLI
```bash
aws configure
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region: us-east-1
# Default output format: json
```

### 3. Clone Repository
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 4. Cập nhật variables.tf
```bash
# Sửa file variables.tf
nano variables.tf
```
```hcl
variable "key_name" {
  default = "my-cicd-key"  # Tên key pair của bạn
}

variable "private_key_path" {
  default = "./my-cicd-key.pem"  # Đường dẫn key file
}
```

## 🚀 Cài đặt từng bước

### Bước 1: Triển khai Infrastructure
```bash
# Khởi tạo Terraform
terraform init

# Kiểm tra plan
terraform plan

# Triển khai (sẽ mất 5-10 phút)
terraform apply
# Type: yes

# Lưu lại IP addresses
terraform output
```

**Kết quả mong đợi:**
```
server1_public_ip = "54.123.45.67"
server2_public_ip = "54.123.45.68"
```

### Bước 2: Kiểm tra Servers
```bash
# Kiểm tra Server 1 (CI/CD)
ssh -i my-cicd-key.pem ec2-user@54.123.45.67
sudo systemctl status jenkins
sudo systemctl status docker
exit

# Kiểm tra Server 2 (App)
ssh -i my-cicd-key.pem ec2-user@54.123.45.68
sudo systemctl status docker
exit
```

### Bước 3: Truy cập Jenkins
1. Mở browser: `http://54.123.45.67:8080`
2. Lấy initial password:
```bash
ssh -i my-cicd-key.pem ec2-user@54.123.45.67
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```
3. Cài đặt suggested plugins
4. Tạo admin user

## ⚙️ Cấu hình Jenkins

### 1. Cài đặt Plugins cần thiết
**Manage Jenkins → Plugins → Available**
- `GitHub Integration Plugin`
- `Docker Pipeline Plugin`
- `Ansible Plugin`
- `Pipeline: GitHub Groovy Libraries`

### 2. Cấu hình Credentials
**Manage Jenkins → Credentials → Global → Add Credentials**

#### a) Docker Hub Credentials
- **Kind**: Username with password
- **ID**: `dockerhub-credentials`
- **Username**: `powder2810` (hoặc username Docker Hub của bạn)
- **Password**: Docker Hub access token

#### b) Server 2 SSH Key
- **Kind**: SSH Username with private key
- **ID**: `server2-ssh-key`
- **Username**: `ec2-user`
- **Private Key**: Copy nội dung file `my-cicd-key.pem`

### 3. Tạo Pipeline Job
1. **New Item → Pipeline → OK**
2. **Pipeline → Definition**: Pipeline script from SCM
3. **SCM**: Git
4. **Repository URL**: `https://github.com/your-username/your-repo.git`
5. **Script Path**: `Jenkinsfile`
6. **Save**

### 4. Cấu hình GitHub Webhook (Tự động trigger)
1. **GitHub repo → Settings → Webhooks**
2. **Add webhook**:
   - **Payload URL**: `http://54.123.45.67:8080/github-webhook/`
   - **Content type**: `application/json`
   - **Events**: `Just the push event`
   - **Active**: ✅

## 🎯 Triển khai ứng dụng

### Cách 1: Tự động (Webhook)
```bash
# Chỉ cần push code
git add .
git commit -m "Deploy new version"
git push origin main
# Jenkins sẽ tự động chạy pipeline!
```

### Cách 2: Thủ công
1. **Jenkins Dashboard → Your Pipeline → Build with Parameters**
2. **Điền thông tin**:
   - `GIT_BRANCH`: `main`
   - `GIT_REPO_URL`: (để trống)
   - `SERVER2_IP`: `54.123.45.68`
3. **Build**

### Theo dõi Pipeline
```
✅ Checkout    - Pull code từ GitHub
✅ Build       - Tạo Docker image  
✅ Scan        - Trivy security scan
✅ Push        - Đẩy lên Docker Hub
✅ Deploy      - Ansible deploy to Server 2
```

### Kiểm tra kết quả
- **Jenkins**: `http://54.123.45.67:8080`
- **Application**: `http://54.123.45.68`
- **Docker Hub**: `https://hub.docker.com/r/powder2810/simple-web`

## 📊 Monitoring và Troubleshooting

### Kiểm tra logs
```bash
# Jenkins logs
ssh -i my-cicd-key.pem ec2-user@54.123.45.67
sudo journalctl -u jenkins -f

# Application logs
ssh -i my-cicd-key.pem ec2-user@54.123.45.68
docker logs simple-web -f
```

### Commands hữu ích
```bash
# Restart Jenkins
sudo systemctl restart jenkins

# Kiểm tra Docker containers
docker ps -a

# Xem Docker images
docker images

# Restart application container
docker restart simple-web

# Check disk space
df -h
```

### Xử lý sự cố thường gặp

#### 🔴 Jenkins không start
```bash
# Kiểm tra Java
java -version
# Kiểm tra port 8080
sudo netstat -tlnp | grep 8080
# Restart service
sudo systemctl restart jenkins
```

#### 🔴 Docker build fail
```bash
# Kiểm tra Dockerfile
cat Dockerfile
# Kiểm tra disk space
df -h
# Clean Docker cache
docker system prune -f
```

#### 🔴 Ansible deploy fail
```bash
# Test SSH connection
ssh -i my-cicd-key.pem ec2-user@SERVER2_IP
# Check Ansible inventory
ansible -i inventory all -m ping
```

#### 🔴 Application không accessible
```bash
# Check container status
docker ps
# Check port mapping
docker port simple-web
# Check security group (port 80 open)
```

## 🔧 Cấu hình nâng cao

### Multi-environment deployment
```bash
# Production (main branch)
GIT_BRANCH: main
SERVER2_IP: production-server-ip

# Staging (dev branch)  
GIT_BRANCH: dev
SERVER2_IP: staging-server-ip
```

### Rollback nhanh
```bash
# Option 1: Chạy lại build cũ
# Jenkins → Build History → Replay

# Option 2: Deploy image cũ
docker run -d -p 80:80 --name simple-web powder2810/simple-web:OLD_BUILD_NUMBER
```

### Backup và Restore
```bash
# Backup Jenkins config
sudo tar -czf jenkins-backup.tar.gz /var/lib/jenkins/

# Backup application data (nếu có)
docker exec simple-web tar -czf /backup.tar.gz /data
```

## ❓ FAQ

**Q: Làm sao thay đổi Docker Hub username?**
A: Sửa `DOCKERHUB_USERNAME` trong Jenkinsfile và cập nhật credentials.

**Q: Có thể dùng private GitHub repo không?**
A: Có, thêm GitHub credentials vào Jenkins và cấu hình trong pipeline.

**Q: Chi phí AWS khoảng bao nhiều?**
A: Với t2.micro Free Tier: ~$0-10/tháng. Ngoài Free Tier: ~$15-20/tháng.

**Q: Làm sao scale nhiều servers?**
A: Sửa `main.tf` để tạo thêm instances và cập nhật Ansible inventory.

**Q: Có thể dùng cloud khác không?**
A: Có, thay đổi Terraform provider (GCP, Azure, DigitalOcean).

## 🎉 Kết luận

Bạn đã hoàn thành setup hệ thống CI/CD hoàn chỉnh! 

**Quy trình làm việc:**
1. Developer push code → GitHub
2. GitHub webhook → Jenkins
3. Jenkins: Build → Test → Deploy
4. Application live trên Server 2

**Next steps:**
- Thêm automated testing
- Setup monitoring (Prometheus/Grafana)
- Implement blue-green deployment
- Add notification (Slack/Email)

## 📞 Hỗ trợ

Nếu gặp vấn đề, check:
1. **Jenkins console logs**
2. **AWS CloudWatch logs** 
3. **GitHub Issues**
4. **Docker Hub build logs**

---
**Happy DevOps! 🚀**