FROM nginx:1.25.4


RUN curl -o /certbot-nginx/ssl-dhparams.pem --create-dirs https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem
RUN curl -o /certbot-nginx/options-ssl-nginx.conf https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf


COPY config/mime.types /etc/nginx/mime.types
COPY config/nginx.conf /etc/nginx/nginx.conf

COPY public /usr/share/nginx/html

RUN apt update && apt install nano wget -y


RUN mkdir -p /script/
COPY entrypoint.sh /script/entrypoint.sh
RUN chmod +x /script/entrypoint.sh
ENTRYPOINT [ "/script/entrypoint.sh" ]