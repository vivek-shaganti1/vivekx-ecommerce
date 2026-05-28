# Production VPS Docker Deployment & Database Migration Guide

This guide describes how to deploy your multi-container application securely on a virtual private server (VPS) with permanent database storage, automated backups, and Nginx proxy routing.

---

## 📂 Production Folder Structure

On your VPS, keep a clean directory layout:
```text
/root/ecommerce/
├── .env
├── docker-compose.yml
├── nginx.conf
├── backup-db.sh
├── backups/               # Created by backup-db.sh
├── certbot/
│   ├── conf/              # Let's Encrypt certificates
│   └── www/               # Certbot validation root
├── vivekx-store-backend/
│   ├── Dockerfile
│   └── ... (project source files)
└── vivekx-store-frontend/
    ├── Dockerfile
    └── ... (project source files)
```

---

## 💾 Phase 1: Local Database Export

To prevent any data loss, export your existing local MySQL database first.

Run the following command on your **local machine** (where your active database is running):

```bash
mysqldump -u root -p trainingdb > trainingdb_dump.sql
```

*Note: If your local database does not have a root password, omit the password value when prompted or run:*
```bash
mysqldump -u root trainingdb > trainingdb_dump.sql
```

---

## 🚀 Phase 2: VPS Environment Setup

### 1. Update OS and Install Docker
Connect to your Hostinger VPS via SSH and execute the following:

```bash
# Update package registries
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin -y
```

### 2. Open Essential Ports
Ensure your firewall allows HTTP, HTTPS, and SSH traffic:
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. Transfer Files to VPS
From your **local machine**, copy your project files to the VPS (replace `YOUR_VPS_IP` with your actual server IP):

```bash
scp -r /Users/vivekshaganti/Desktop/Projects/vivekx-ecommerce root@YOUR_VPS_IP:/root/ecommerce
scp trainingdb_dump.sql root@YOUR_VPS_IP:/root/ecommerce/trainingdb_dump.sql
```

---

## 🛠️ Phase 3: Launch Containers & Import Data

### 1. Build and Run Container Orchestration
On the **VPS terminal**, navigate to the directory and start the services:

```bash
cd /root/ecommerce
docker compose up -d --build
```

### 2. Verify Services are Running
Check container status and health states:
```bash
docker compose ps
```
*Wait until the `ecommerce-mysql` container status is marked as `healthy` before moving to the next step.*

### 3. Restore/Import Local Data into Container
Import the sql dump directly into the running MySQL container:

```bash
docker exec -i ecommerce-mysql mysql -u root -psupersecurepassword123 trainingdb < trainingdb_dump.sql
```
*(Replace `supersecurepassword123` with the password specified in your `.env` file).*

### 4. Verify Data Exists
Execute a query inside the container to confirm products are imported:
```bash
docker exec -it ecommerce-mysql mysql -u root -psupersecurepassword123 -e "USE trainingdb; SELECT COUNT(*) FROM product;"
```

---

## 🔒 Phase 4: SSL Certificate Setup (Let's Encrypt)

Once Nginx is up, configure Certbot to obtain valid SSL certificates.

### 1. Run Certbot in Docker
Run a temporary certbot container to issue certificates:
```bash
docker run -it --rm --name certbot \
  -v "/root/ecommerce/certbot/conf:/etc/letsencrypt" \
  -v "/root/ecommerce/certbot/www:/var/www/certbot" \
  certbot/certbot certonly --webroot \
  -w /var/www/certbot \
  -d yourdomain.com -d www.yourdomain.com \
  --email vivekshaganti@gmail.com --agree-tos --no-eff-email
```

### 2. Enable SSL in Nginx
1. Open `/root/ecommerce/nginx.conf`.
2. Uncomment the HTTPS server block (remove `#` symbols).
3. Replace `yourdomain.com` with your registered domain.
4. Reload Nginx configuration:
```bash
docker compose exec frontend nginx -s reload
```

---

## ⏰ Phase 5: Automated Backups

To automate backups daily at 2:00 AM, set up a cron job.

### 1. Test Backup Script Locally on VPS
```bash
cd /root/ecommerce
./backup-db.sh
```
*Verify that a compressed SQL file is written inside the `./backups/` directory.*

### 2. Configure Cron
Open cron file:
```bash
crontab -e
```
Add the following line to execute the backup script daily at 2:00 AM:
```text
0 2 * * * cd /root/ecommerce && ./backup-db.sh >> /var/log/db_backup.log 2>&1
```

---

## ⚠️ Common Deployment Mistakes

1. **Hibernate DDL setting on Update**: Keeping `spring.jpa.hibernate.ddl-auto=update` in production can lead to unexpected table locks or column changes. Always use `validate` for production deployments.
2. **Docker Network Mismatches**: Connecting via `localhost` inside a Docker container maps to the container itself, not the host machine. Always connect to the database container name (`jdbc:mysql://mysql:3306/...`).
3. **No Volume Mounts**: Failing to define volume mappings (`mysql_data:/var/lib/mysql`) results in database storage being written to the container layer, meaning all database modifications disappear whenever the container is rebuilt or updated.

---

## 🔍 Debugging & Health Check Cheat Sheet

- **Inspect Logs**:
  ```bash
  docker compose logs -f backend
  docker compose logs -f mysql
  ```
- **Enter Database Shell**:
  ```bash
  docker compose exec mysql mysql -u root -p
  ```
- **Test Endpoint Resolution**:
  ```bash
  curl -I http://localhost:8080/api/products
  ```
