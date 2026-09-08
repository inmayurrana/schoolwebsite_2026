# Cambridge International School, Mandi — On-Premise Deployment Guide

This guide describes how to deploy the web application on a local or on-premise Linux server (Ubuntu 22.04 / 24.04 LTS or Debian) with limited hardware resources (1GB–2GB RAM, 1–2 CPU cores).

---

## 🖥️ Minimum Hardware Requirements

| Component | Minimum | Recommended |
|---|---|---|
| **CPU** | 1 Core (x86_64 or ARM64) | 2 Cores |
| **RAM** | 1 GB (+ 2GB Swap enabled) | 2 GB to 4 GB |
| **Storage** | 10 GB HDD / SSD | 25 GB SSD |
| **Operating System** | Ubuntu 22.04 / 24.04 LTS | Ubuntu 24.04 LTS |

---

## 🚀 Quick Step-by-Step Installation

### Step 1: Run System Provisioning Script
On your Ubuntu server terminal, run:
```bash
chmod +x deploy/setup-onprem-linux.sh
./deploy/setup-onprem-linux.sh
```
This script automatically:
1. Installs Node.js 22 LTS, Nginx, PM2, SQLite, and UFW firewall.
2. Configures a **2GB swapfile** to prevent Out-Of-Memory (OOM) crashes on low-RAM servers.
3. Tunes Linux virtual memory swappiness.

---

### Step 2: Build Application
```bash
cd /var/www/cismandi

# Install dependencies
npm install

# Push database schema and seed initial data
npx prisma db push
node prisma/seed.js

# Build production bundle (Standalone mode)
npm run build
```

---

### Step 3: Start Node.js with PM2 Process Manager
```bash
# Start with 400MB memory ceiling to guarantee zero resource starvation
pm2 start npm --name "cismandi-web" --max-memory-restart 400M -- run start

# Enable PM2 to auto-start on server reboot
pm2 save
pm2 startup
```

---

### Step 4: Configure Nginx & Firewall
```bash
sudo cp deploy/nginx-onprem.conf /etc/nginx/sites-available/cismandi
sudo ln -s /etc/nginx/sites-available/cismandi /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Configure Firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable
```

---

### Step 5: (Optional) Free SSL Certificate via Let's Encrypt
If the server has a public IP/domain (e.g. `cismandi.edu.in`):
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d cismandi.edu.in -d www.cismandi.edu.in
```

---

### Step 6: Automated Daily Backups (Cron)
Add the backup script to cron:
```bash
chmod +x /var/www/cismandi/deploy/backup-onprem.sh
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/cismandi/deploy/backup-onprem.sh >> /var/log/cismandi_backup.log 2>&1") | crontab -
```

---

## 🔑 Administrative Access

- **Admin CMS URL:** `http://YOUR_SERVER_IP/admin`
- **Default Super Admin:** `admin@cismandi.edu.in`
- **Default Password:** `Admin@12345`
- **Principal Account:** `principal@cismandi.edu.in` / `Admin@12345`
- **Staff Editor Account:** `editor@cismandi.edu.in` / `Admin@12345`
