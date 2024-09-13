import {sql} from 'drizzle-orm';

const EOL: string = "\n";
const EOLx2: string = EOL.repeat(2);

export class Exporter {

    private static dns = "95.167.167.95, 95.167.167.96"; // FIXME: доставать адреса из таблицы настроек;

    public static async exportDHCPConfig(payload: any): Promise<string> {
        const groupsArr: any[] = [];
        const groups = await payload.db.drizzle.execute(sql.raw(`SELECT * FROM rooms`));
        const hosts = await payload.db.drizzle.execute(
            sql.raw(`
                        SELECT hr.parent_id, hr.gateways_id, s.rooms_id,
                                s.name, s.room_enabled,
                                g.ip_address as gw_ip,
                                g.is_enabled as gw_enabled,
                                h.ip_address,
                                h.mac_address, h.is_wifi_adapter,
                                h.is_enabled, h.net_mask,
                                h."name"
                                FROM public.hosts_rels hr
                                INNER JOIN (
                                    SELECT parent_id, rooms_id,
                                            rooms.is_enabled as room_enabled,
                                            rooms.name from hosts_rels 
                                                INNER JOIN rooms ON rooms.id = hosts_rels.rooms_id 
                                                    WHERE path = 'room'
                                    ) s ON s.parent_id = hr.parent_id 
                                INNER JOIN gateways g ON g.id = hr.gateways_id
                                INNER JOIN hosts h ON h.id = hr.parent_id
                                WHERE hr."path" = 'gateway'
                        `
            )
        );

        for (const group of groups.rows) {
            const hostsWithSameGroup = hosts.rows.filter((host: any) => host.rooms_id === group.id);

            const hostsForDhcp = [];
            if (hostsWithSameGroup.length) {
                let gwIp = hostsWithSameGroup[0].gw_ip;
                if (!hostsWithSameGroup[0].gw_enabled) {
                    gwIp = ""
                }
                if (hostsWithSameGroup[0].room_enabled) {
                    hostsWithSameGroup.forEach((host: any) => {
                        if (host.is_enabled) {
                            hostsForDhcp.push(this.getHost(host.name, host.mac_address, host.ip_address));
                        }
                    });
                }
                groupsArr.push(this.getGroup(gwIp, this.dns, hostsForDhcp.join(EOLx2), group.name));
            }
        }
        //return groupsArr
        return Exporter.getConfig(groupsArr.join(EOLx2));
    }

    private static getConfig(groups: string): string {
        // отступ у текста с 60 строки влияют на отображение файла в plaintext! Не нужно их делать!
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

    private static getGroup(gw: string, dns: string, hosts: string, comment: string = ''): string {
        const res: string[] = [''];

        res.push(`    #${comment}`);

        if (!gw?.length) {
            // здесь тоже с отступами всё правильно теперь. хоть и некрасиво...
            res.push(`    group {
    option domain-name-servers ${dns};
    default-lease-time 1800;
    max-lease-time 7200;
      group {
        next-server 10.207.151.254;
        filename    "pxelinux.0";
        
        # HOSTS BY MAC-ADDRESSES
        ${hosts}
      }
    }`
            );
        } else {
            // и здесь тоже
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
    }`
            );
        }
        return res.join(EOL);
    }

    private static getHost(name: string, mac: string, ip: string): string {
        return `          host ${name} {
                hardware ethernet ${mac};
                fixed-address ${ip};
              }
              `;
    }
}