# Pigeon Build Server

Four apps in Docker containers to run a fully functional build server:
- Nginx 1.25.4
- Portainer 2.19.4
- Nexus 3.65.0
- Jenkins 2.440.1 LTS JDK21
- Open LDAP
- PostgreSQL 15.6
- SonarQube 10.4.1

## Components

### Open LDAP

```bash
docker run -d --name pigeon-openldap-server -e LDAP_ORGANISATION="CP Systems" -e LDAP_DOMAIN="cp-sys.hu" -e LDAP_ADMIN_PASSWORD="?" -v openldap_db:/var/lib/ldap -v openldap_cfg:/etc/ldap/slapd.d osixia/openldap:1.5.0
```

```bash
docker run -d --name pigeon-openldap-admin -p 6443:443 -e PHPLDAPADMIN_LDAP_HOSTS=pigeon-openldap-server osixia/phpldapadmin:0.9.0
```

### Portainer

```bash
docker run -d --name pigeon-portainer --restart always -p 2000:8000 -p 2001:9000 -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:2.19.0
```

### Nexus
Sonatype does not provide arm64 images, but it can easily be [built from source](https://github.com/sonatype/docker-nexus3).

```bash
docker run -d --name pigeon-nexus --restart always -p 2002:8081 -p 1900:1900 -p 1901:1901 -p 1902:1902 -e NEXUS_CONTEXT=nexus/ -v nexus_data:/nexus-data sonatype/nexus3:3.60.0
```

### Jenkins

```bash
docker build --tag pigeon-jenkins-controller:2.414.1-lts-jdk17 ./pigeon-jenkins
docker run -d --name pigeon-jenkins-controller --restart always -p 2999:8080 -p 50000:50000 -e "JENKINS_OPTS=--prefix=/jenkins" -v jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock pigeon-jenkins-controller:2.414.1-lts-jdk17
```

### Nginx Proxy Fuckery

1. Generate a dummy certificate on the host machine in a directory, replacing `<domain>` with your own (later to be mounted to the nginx container)
```bash
openssl req -x509 -nodes -newkey rsa:4096 -days 1 -keyout /letsencryptdata/etc/letsencrypt/live/<domain>/privkey.pem -out /letsencryptdata/etc/letsencrypt/live/<domain>/fullchain.pem -subj "/CN=localhost"
```
2. Make sure nginx is configured to serve a shared root directory (e.g. `/letsencryptdata/www`) through http at `<domain>/.well-known/acme-challenge/`. Already set up in this repo.
3. Start nginx, making sure that the dummy certificate is accessible through a mounted volume from host
```bash
docker build --tag pigeon-nginx:1.25.2 ./pigeon-nginx
docker run -d --name pigeon-nginx -p 80:80 -p 443:443 -v /letsencryptdata/etc/letsencrypt:/etc/letsencrypt -v /letsencryptdata/www:/var/www/certbot pigeon-nginx:1.25.2
```
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
