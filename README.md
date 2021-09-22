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
sudo docker run -d -p 2999:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home pigeon-jenkins-controller
```