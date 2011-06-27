#!/bin/bash

aptitude ppa:chris-lea/node.js
aptitude update
aptitude full-upgrade
aptitude install nginx redis-server mongodb monit
#install nodejs
#curl http://npmjs.org/install.sh | clean=no sh
#npm install -g connect redis cluster jasmine-node mongodb

# node, npm, cluster
# new configs: nginx monit
# upgrade data in mongodb
# node cluster init.d script