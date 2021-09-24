#!/bin/bash
set -e

SLEEP_TIME=2
declare -a DEPENDENCIES=("pigeon-nexus:8081", "pigeon-jenkins-controller:8080")
for d in ${DEPENDENCIES[@]}; do 
  echo "waiting for $d to be available";
  until wget -S -O - http://$d 2>&1 | grep "HTTP/" | awk '{print $2}' | grep "200\|404\|403\|401\|301\|302" &> /dev/null
  do
      echo "$d unavailable, sleeping for ${SLEEP_TIME}"
      sleep "${SLEEP_TIME}"
  done
done

nginx -g daemon off;