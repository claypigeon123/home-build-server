FROM nginx

COPY config/nginx.conf /etc/nginx/nginx.conf

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/cert.key -out /etc/nginx/cert.crt \
    -subj "/C=HU/ST=Budapest/L=Budapest/O=cp-sys/OU=cp-sys/CN=Zoltan Nagy"