#!/bin/bash

echo "Container Started"

npm install --legacy-peer-deps

npm run migrate:run

npm run seed

npm run start:debug