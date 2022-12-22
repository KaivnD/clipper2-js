FROM emscripten/emsdk:3.1.20

# 更改镜像为阿里镜像源
RUN rm -f /etc/apt/sources.list

RUN echo "deb http://mirrors.163.com/ubuntu/ focal main restricted universe multiverse" >> /etc/apt/sources.list && \
echo "deb http://mirrors.163.com/ubuntu/ focal-security main restricted universe multiverse" >> /etc/apt/sources.list && \
echo "deb http://mirrors.163.com/ubuntu/ focal-updates main restricted universe multiverse" >> /etc/apt/sources.list && \
echo "deb http://mirrors.163.com/ubuntu/ focal-proposed main restricted universe multiverse" >> /etc/apt/sources.list && \
echo "deb http://mirrors.163.com/ubuntu/ focal-backports main restricted universe multiverse" >> /etc/apt/sources.list

RUN apt update

RUN apt install -y curl clang bash git grep unzip gzip sudo perl python3

RUN adduser xmake \
    && echo "xmake ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers.d/xmake \
    && chmod 0440 /etc/sudoers.d/xmake

USER xmake

RUN curl -fsSL https://xmake.io/shget.text | bash \
    && sudo ln -s ~/.local/bin/xmake /usr/bin/xmake \
    && sudo ln -s ~/.local/bin/xrepo /usr/bin/xrepo

RUN git clone https://gitee.com/xmake-mirror/build-artifacts.git /home/xmake/.xmake/repositories/build-artifacts
RUN git clone https://gitee.com/tboox/xmake-repo.git /home/xmake/.xmake/repositories/xmake-repo

RUN npm i -g pnpm