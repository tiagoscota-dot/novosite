# Imagem base leve e de alto desempenho para arquivos estáticos
FROM nginx:alpine

# Remover a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar a configuração personalizada do Nginx otimizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos estáticos do portal para a pasta do Nginx
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

# Expor a porta 80 do container
EXPOSE 80

# Iniciar o Nginx no container
CMD ["nginx", "-g", "daemon off;"]
