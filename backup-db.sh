#!/bin/bash

# ==========================================================
# AUTOMATED MYSQL BACKUP SCRIPT FOR DOCKER CONTAINER
# ==========================================================

# 1. Load config variables from .env file
export $(grep -v '^#' .env | xargs)

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/backup_${MYSQL_DATABASE}_${TIMESTAMP}.sql.gz"

# Create backup folder if not exists
mkdir -p ${BACKUP_DIR}

echo "Starting database backup for database '${MYSQL_DATABASE}'..."

# 2. Run mysqldump inside the docker container
docker exec ecommerce-mysql mysqldump -u root -p"${MYSQL_ROOT_PASSWORD}" "${MYSQL_DATABASE}" | gzip > "${BACKUP_FILE}"

if [ $? -eq 0 ]; then
  echo "Backup successfully created: ${BACKUP_FILE}"
else
  echo "Error: Database backup failed!"
  exit 1
fi

# 3. Clean up backups older than 7 days to preserve disk space
echo "Cleaning up backups older than 7 days..."
find ${BACKUP_DIR} -name "backup_${MYSQL_DATABASE}_*.sql.gz" -mtime +7 -delete

echo "Database backup routine completed."
