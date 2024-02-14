import { Gateways } from 'src/db/entity/Gateways.entity';
import { Hosts } from 'src/db/entity/Hosts.entity';

const path = require('path');
const fs = require('fs');

function getConfig(groups) {
  return `# DHCP server is authoritative for all networks
authoritative;

# extra options
# RFC3442 routes
option rfc3442-classless-static-routes code 121 = array of integer 8;
# MS routes
option ms-classless-static-routes code 249 = array of integer 8;
# Cisco IP phones
option voip-tftp-servers code 150 = array of ip-address;
option shoretel-director-server code 155 = ip-address;

#pid-file-name "/var/run/dhcp-server/dhcpd.pid";

ddns-update-style none;

allow booting;
allow bootp;

default-lease-time 1800;
max-lease-time 7200;

# MAIN NETWORK -- ONLY HOSTS BY MAC-ADDRESSES

shared-network espd {

    subnet 10.207.144.0 netmask 255.255.248.0 {
    
      option routers 10.207.144.1;                              # default gateway
      #option routers 10.207.151.253;                             # default gateway
      option domain-name-servers 95.167.167.95, 95.167.167.96;  # dns nameservers
      #option domain-name-servers 10.207.151.252;  # dns nameservers
      default-lease-time 1800;
      max-lease-time 7200;
      
      pool {
        next-server 10.207.151.254;
        filename    "pxelinux.0";
        range 10.207.146.0 10.207.146.254;
      }
    
    }
    
${groups}
}`;
}

function getGroup(gw, dns, hosts, comment = '') {
  const res = [''];

  if (comment.length) {
    res.push(`    #${comment}`);
  }

  res.push(`    group {
      option routers ${gw};
      option domain-name-servers ${dns};
      default-lease-time 1800;
      max-lease-time 7200;
        group {
          next-server 10.207.151.254;
          filename    "pxelinux.0";
          
          # HOSTS BY MAC-ADDRESSES
${hosts}
        }
    }`);

  return res.join(`\n`);
}

function getHost(name, mac, ip) {
  return `          host ${name} {
            hardware ethernet ${mac};
            fixed-address ${ip};
          }
          `;
}

function isValidHostData(hostname, ip, mac, enabled) {
  let isValid = true;

  isValid = isValid && enabled; // enabled

  isValid = isValid && /^[a-z0-9_]+$/.test(hostname); // name ok

  isValid = isValid && /^[0-9ABCDEF\:]+$/.test(mac); // mac ok

  if (ip) {
    const splittedIp = ip.split('.');

    let ipIsOk = true; // ip ok

    for (let i = 0; i < splittedIp.length; i++) {
      if (Number(splittedIp[i]) < 1 || Number(splittedIp[i]) > 254) {
        ipIsOk = false;
        break;
      }
    }

    isValid = isValid && ipIsOk;
  } else {
    isValid = isValid && false;
  }

  return isValid;
}

export default async () => {
  const groups = []; // массив групп хостов

  // Идём по каждому листу документа
  var hosts = await Hosts.find();
  hosts.forEach(async (host) => {
    console.log(`Конфигурируем dhcp для`);

    // массив хостов, первой строкой в котором будет закомментированная строка с названием компьютерного класса из имени листа
    const hosts = [];
    let gateway = await Gateways.findOneBy({ id: parseInt(host.gate_id) });
    let gw = gateway.ip_addr;
    let dns = '8.8.8.8';

    let hostname = host.name;
    if (hostname) {
      hostname = hostname.toString().trim().toLowerCase();
    }

    let ip = host.ip_addr;
    if (ip) {
      ip = ip.toString().trim().toLowerCase();
    }

    let mac = host.mac_addr;

    if (mac) {
      mac = mac.toString().trim().toUpperCase();
    }

    let enabled = host.is_active;
    console.log(isValidHostData(hostname, ip, mac, enabled));
    if (isValidHostData(hostname, ip, mac, enabled)) {
      hosts.push(getHost(hostname, mac, ip));
    } else {
      // console.log(`Хост с именем ${hostname}, ip ${ip}, mac ${mac}, enabled: ${enabled} не добавлен в конфиг (выключен в конфиге или неверные параметры) !`);
    }

    groups.push(getGroup(gw, dns, hosts.join(`\n`)));
    console.log(getConfig(groups.join(`\n`)));
  });
};
