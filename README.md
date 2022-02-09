# Pigeon Build Server

Four apps in Docker containers to run a fully functional build server:
- Nginx
- Portainer
- Nexus
- Jenkins

## Images

### Portainer

```
sudo docker run -d -p 2000:8000 -p 2001:9000 --name pigeon-portainer --restart always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce
```

### Nexus

```
sudo docker run -d -p 2002:8081 -p 1900:1900 -p 1901:1901 -p 1902:1902 --name pigeon-nexus -v nexus_data:/nexus-data klo2k/nexus3
```

### Jenkins

```
sudo docker build --tag pigeon-jenkins-controller ./pigeon-jenkins
sudo docker run -d -p 2999:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock --name pigeon-jenkins-controller pigeon-jenkins-controller
```

### Nginx Proxy Fuckery

1. Set up nginx according to needs - solid base provided in this repo
2. Generate a dummy certificate on the host machine in a directory, replacing `<domain>` with your own (later to be mounted to the nginx container)
```
sudo openssl req -x509 -nodes -newkey rsa:4096 -days 1 -keyout /letsencryptdata/etc/letsencrypt/live/<domain>/privkey.pem -out /letsencryptdata/etc/letsencrypt/live/<domain>/fullchain.pem -subj "/CN=localhost"
```
3. Make sure nginx is configured to serve a shared root directory (e.g. `/letsencryptdata/www`) through http at `<domain>/.well-known/acme-challenge/`. Already set up in this repo.
4. Start nginx, making sure that the dummy certificate is accessible through a mounted volume from host
```
sudo docker build --tag pigeon-nginx ./pigeon-nginx
```
```
sudo docker run -d --name pigeon-nginx -p 80:80 -p 443:443 -v /letsencryptdata/etc/letsencrypt:/etc/letsencrypt -v /letsencryptdata/www:/var/www/certbot pigeon-nginx
```
5. Run the certificate generator
```
sudo docker run -it --rm --name certbot -v "/letsencryptdata/etc/letsencrypt:/etc/letsencrypt" -v "/letsencryptdata/var/lib/letsencrypt:/var/lib/letsencrypt" -v "/letsencryptdata/www:/var/www" certbot/certbot:arm64v8-latest certonly
```
6. Verify that the generated certificates have replaced the dummy ones
7. Bash into nginx container and reload nginx service
```
service nginx reload
```