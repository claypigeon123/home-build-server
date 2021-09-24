# Pigeon Build Server

## Images

### Portainer

```
sudo docker build --file ./pigeon-portainer --tag pigeon-portainer .
sudo docker run -d -p 2000:8000 -p 2001:9000 --name pigeon-portainer --restart always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data pigeon-portainer
```

### Nexus

```
sudo docker build --file ./pigeon-nexus/Dockerfile --tag pigeon-nexus .
sudo docker run -d -p 2002:8081 -p 1900:1900 -p 1901:1901 -p 1902:1902 --name pigeon-nexus pigeon-nexus
```

### Jenkins

```
sudo docker build --file ./pigeon-nexus/Dockerfile --tag pigeon-jenkins-controller
sudo docker run -d -p 2999:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home --name pigeon-jenkins-controller pigeon-jenkins-controller
```

### Nginx Proxy Fuckery

1. Set up nginx according to your needs
2. Generate a dummy certificate on the host in a directory (later to be mounted to the nginx container)
```
sudo openssl req -x509 -nodes -newkey rsa:4096 -days 1 -keyout /letsencryptdata/etc/letsencrypt/live/<domain>/privkey.pem -out /letsencryptdata/etc/letsencrypt/live/<domain>/fullchain.pem -subj "/CN=localhost"
```
3. Make sure nginx is configured to serve a shared root directory (e.g. `/letsencryptdata/www`) through http at `<domain>/.well-known/acme-challenge/`
4. Start nginx, making sure that the dummy certificate is accessible through a mounted volume from host
```
sudo docker build -t pigeon-nginx ./pigeon-nginx
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