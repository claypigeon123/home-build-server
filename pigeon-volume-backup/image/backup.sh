#!/bin/bash

# https://github.com/jareware/docker-volume-backup/blob/master/Dockerfile

info "Backup starting"
TIME_START="$(date +%s.%N)"
# DOCKER_SOCK="/var/run/docker.sock"

info "Creating backup"
BACKUP_FILENAME="$(date +"${BACKUP_FILENAME:-backup-%Y-%m-%dT%H-%M-%S.tar.gz}")"
TIME_BACK_UP="$(date +%s.%N)"
tar -czvf "$BACKUP_FILENAME" /backup
BACKUP_SIZE="$(du --bytes $BACKUP_FILENAME | sed 's/\s.*$//')"
TIME_BACKED_UP="$(date +%s.%N)"

if [ ! -z "$AWS_S3_BUCKET_NAME" ]; then
    info "Uploading backup to S3"
    echo "Will upload to bucket \"$AWS_S3_BUCKET_NAME\""
    aws s3 cp --only-show-errors "$BACKUP_FILENAME" "s3://$AWS_S3_BUCKET_NAME/"
    echo "Upload finished"
fi

info "Backup finished"