#!/bin/bash


mongo aden \
           ./format.js \
           ./network.js \
           ./template.js \
           ./campaign.js \
           ./flight.js \
           ./profile.js \
           ./creative.js \
           ./banner.js \
           ./site.js \
           ./page.js \
           ./place.js \
           ./plug.js

node ./template.node.js