# Pigeon Build Server

Various software in Docker containers to run a fully functional build server, exposed through an nginx reverse proxy setup.

Docker compose provided.

## Components

- Nginx 1.25.5
- Portainer 2.20.2
- Nexus 3.68.1
- Jenkins 2.452.1 LTS JDK21
- Bitnami Open LDAP 2.5.17 (+ dnknth/ldap-ui)
- PostgreSQL 15.6
- SonarQube 10.5.1

## Nginx Proxy Fuckery

1. Generate a dummy certificate on the host machine in a directory, replacing `<domain>` with your own (later to be mounted to the nginx container)
```bash
openssl req -x509 -nodes -newkey rsa:4096 -days 1 -keyout /letsencryptdata/etc/letsencrypt/live/<domain>/privkey.pem -out /letsencryptdata/etc/letsencrypt/live/<domain>/fullchain.pem -subj "/CN=localhost"
```
2. Make sure nginx is configured to serve a shared root directory (e.g. `/letsencryptdata/www`) through http at `<domain>/.well-known/acme-challenge/`. Already set up in this repo.
3. Start nginx, making sure that the dummy certificate is accessible through a mounted volume from host
4. Run the certificate generator
```bash
docker run -it --rm --name certbot -v "/letsencryptdata/etc/letsencrypt:/etc/letsencrypt" -v "/letsencryptdata/var/lib/letsencrypt:/var/lib/letsencrypt" -v "/letsencryptdata/www:/var/www" certbot/certbot certonly
```
5. Verify that the generated certificates have replaced the dummy ones
6. Bash into nginx container and reload nginx service
```bash
docker exec -it pigeon-nginx /bin/bash
service nginx reload
```
