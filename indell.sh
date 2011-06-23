#!/bin/bash

aptitude update
aptitude install nginx redis-server mongodb monit

# node, npm, cluster
# new configs: nginx monit
# upgrade data in mongodb
# node cluster init.d script