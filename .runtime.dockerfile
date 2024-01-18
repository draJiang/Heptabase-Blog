FROM nginx:stable-bullseye
ADD ./.deploy/blog.conf /etc/nginx/nginx.conf
ADD ./build /var/www/