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


```
sudo docker build -t pigeon-nginx ./pigeon-nginx
```

```
sudo docker run -d --name pigeon-nginx -p 80:80 -p 443:443 -v /letsencryptdata/etc/letsencrypt:/etc/letsencrypt -v /letsencryptdata/www:/var/www/certbot pigeon-nginx
```

```
sudo openssl req -x509 -nodes -newkey rsa:4096 -days 1 -keyout ./privkey.pem -out ./fullchain.pem -subj "/CN=localhost"
```

```
sudo docker run -it --rm --name certbot -v "/letsencryptdata/etc/letsencrypt:/etc/letsencrypt" -v "/letsencryptdata/var/lib/letsencrypt:/var/lib/letsencrypt" -v "/letsencryptdata/www:/var/www" certbot/certbot:arm64v8-latest certonly
```