FROM node:4-onbuild

# replace this with your application's default port
#RUN npm install request
#RUN npm install dateformat
#RUN npm install express
#RUN npm install nedb
#RUN npm install cron

#ADD . /usr/src/app/

#VOLUME ["/home/ec2-user/log", "/usr/src/app/log"]

EXPOSE 9090
