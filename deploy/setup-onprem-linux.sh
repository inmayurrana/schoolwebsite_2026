#!/usr/bin/env bash
# ==============================================================================
# Cambridge International School, Mandi — On-Premise Linux Setup Script
# Optimized for Low-Resource Hardware (1GB - 2GB RAM / 1-2 vCPUs)
# ==============================================================================

set -e

echo "🚀 Starting setup for Cambridge International School Mandi Website..."

# 1. Update and install base utilities
echo "📦 Updating package repositories..."
sudo apt-get update -y
sudo apt-get install -y curl wget git nginx ufw logrotate sqlite3

# 2. Configure 2GB Swap Memory (Prevents Out-Of-Memory crashes on low-RAM servers)
if [ ! -f /swapfile ]; then
    echo "🧠 Configuring 2GB Swap file for low-resource stability..."
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    sudo sysctl vm.swappiness=10
    echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
fi

# 3. Install Node.js 22 LTS & PM2
if ! command -v node &> /dev/null; then
    echo "🟢 Installing Node.js LTS..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "🟢 Node version: $(node -v)"
echo "🟢 NPM version: $(npm -v)"

sudo npm install -g pm2

# 4. Create App Directory & Clone/Copy Repo
APP_DIR="/var/www/cismandi"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

echo "📂 Application directory created at $APP_DIR"
echo "👉 Place project files in $APP_DIR"

# 5. Build and Run instructions
cat << 'EOF'
==============================================================================
✅ System prerequisites installed successfully!

Next steps to launch:
1. Copy code to /var/www/cismandi
2. cd /var/www/cismandi
3. cp .env.example .env
4. npm install --production=false
5. npx prisma db push && node prisma/seed.js
6. npm run build
7. pm2 start npm --name "cismandi-web" --max-memory-restart 400M -- run start
8. pm2 save && pm2 startup
==============================================================================
EOF
