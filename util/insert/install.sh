#!/bin/bash

mongoimport --db aden --drop --collection format --file ./format.json
mongoimport --db aden --drop --collection network --file ./network.json
mongoimport --db aden --drop --collection template --file ./template.json
mongoimport --db aden --drop --collection site --file ./site.json
mongoimport --db aden --drop --collection page --file ./page.json
mongoimport --db aden --drop --collection place --file ./place.json