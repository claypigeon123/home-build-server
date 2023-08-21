FROM debian:bookworm

# Setup
RUN apt-get update
RUN apt-get install -y --no-install-recommends curl ca-certificates openssh-client iputils-ping unzip bash gpg dpkg

# Docker - not needed for now
# RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && chmod a+r /etc/apt/keyrings/docker.gpg
# RUN echo \
#     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
#     "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
#     tee /etc/apt/sources.list.d/docker.list > /dev/null
# RUN apt-get update && apt-get install -y docker-ce-cli

# AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-$(dpkg --print-architecture | awk '{if ($1 == "arm64") print "aarch64"; else if ($1 == "amd64") print "x86_64"}').zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install
RUN rm -rf awscliv2.zip

RUN mkdir -p /root/backup.sh
COPY backup.sh /root/backup.sh
RUN chmod a+x /root/backup.sh

WORKDIR /root
ENTRYPOINT [ "/root/backup.sh" ]