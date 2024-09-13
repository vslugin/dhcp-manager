#!/bin/bash
systemctl stop dhcp-manager
rm -rf /srv/dist
# rm -rf node_modules
# npm install
npm ci
npm run build
mv dist /srv/
ln -s ~/dhcp-manager/node_modules /srv/dist/node_modules
ln -s ~/.env /srv/dist/.env

#cd /srv/dist
#node seedDatabase.js

systemctl restart dhcp-manager

exit 0