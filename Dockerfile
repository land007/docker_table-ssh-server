FROM land007/node:latest

MAINTAINER Yiqiu Jia <yiqiujia@hotmail.com>

RUN . $HOME/.nvm/nvm.sh && cd / && npm install ssh2 formidable xlsx
COPY node /node_

#docker build -t land007/table-ssh-server:latest .
#> docker buildx build --platform linux/amd64,linux/arm64/v8,linux/arm/v7 -t land007/table-ssh-server --push .
#docker rm -f table-ssh-server; docker run --rm -it --name table-ssh-server -v /Users/jiayiqiu/git/docker_table-ssh-server/node:/node -p 80:80 land007/table-ssh-server:latest
#docker run --rm -it --name table-ssh-server -p 80:80 land007/table-ssh-server:latest
#docker exec -it table-ssh-server bash
#docker save -o table-ssh-server.tar land007/table-ssh-server:latest
#chmod 777 table-ssh-server.tar && gzip table-ssh-server.tar
#docker load -i table-ssh-server.tar.gz
