#!/bin/bash
# ==============================================================================
# Automated Daily Backup Script for Cambridge Mandi On-Premise Server
# Backs up SQLite database and uploads directory to /var/backups/cismandi/
# ==============================================================================

BACKUP_DIR="/var/backups/cismandi"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
APP_DIR="/var/www/cismandi"

mkdir -p $BACKUP_DIR

echo "📦 Backing up Cambridge Mandi database and uploads..."

# 1. Hot backup of SQLite database
if [ -f "$APP_DIR/prisma/dev.db" ]; then
    sqlite3 "$APP_DIR/prisma/dev.db" ".backup '$BACKUP_DIR/cismandi_db_$TIMESTAMP.sqlite'"
fi

# 2. Archive uploaded documents and media
if [ -d "$APP_DIR/public/uploads" ]; then
    tar -czf "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" -C "$APP_DIR/public" uploads
fi

# 3. Retain only last 14 days of backups to prevent disk overflow
find $BACKUP_DIR -type f -mtime +14 -exec rm {} \;

echo "✅ Backup completed successfully at $BACKUP_DIR"
