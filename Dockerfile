FROM nginx:latest

# work dir 설정
WORKDIR /app

# build 폴더를 workdir 의 build 폴더로 복사
ADD ./build ./build

# host pc 의 nginx.conf 를 아래 경로에 복사
COPY ./default.conf /etc/nginx/conf.d