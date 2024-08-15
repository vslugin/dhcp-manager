#!/bin/bash
npm ci
#cp .env_example .env
#npm install yarn
#systemctl stop backend
npm run build
cp -r dist /srv/
#ln -s /home/dhcp-manager/node_modules /srv/dist/node_modules
#ln -s /home/dhcp-manager/.env /srv/dist/.env
#ln -s /home/dhcp-manager/src/seed/excel_docs /srv/dist/seed/excel_docs
cd /srv/dist
#node seedDatabase.js
#node seedFromEXCEL.js

systemctl restart dhcp-manager

exit 0

cat << 'EOF' > /etc/systemd/system/dhcp-manager.service
[Unit]
Description=dhcp-manager
Requires=network-online.target
After=network-online.target

[Service]
Restart=on-failure
RestartSec=3s
WorkingDirectory=/srv/dist
ExecStart=node server.js
User=root
Group=root

[Install]
WantedBy=multi-user.target
EOF
