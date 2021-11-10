FROM ubuntu:21.04

RUN apt-get update

RUN apt-get install -y curl

RUN apt-get install -y nodejs
RUN apt install npm