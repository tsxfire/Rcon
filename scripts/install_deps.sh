#!/bin/bash
sudo apt update && sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs build-essential
npm install -g wscat
npm install -g pm2
npm install minecraft-protocol@latest
npm install --save-dev @types/express @types/ws
npm install inquirer @types/inquirer
npm install express cors @types/express @types/cors ws