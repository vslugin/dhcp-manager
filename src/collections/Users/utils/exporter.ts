import { sql } from 'drizzle-orm';

export class Exporter {
    private static dns = "95.167.167.95, 95.167.167.96"
    public static async exportDHCPConfig(payload){
        var groupsArr = []
        const groups =  await payload.db.drizzle.execute(sql.raw(`SELECT * FROM rooms`))
        const hosts = await payload.db.drizzle.execute(sql.raw(`
SELECT hr.parent_id,hr.gateways_id, s.rooms_id, --Debug columns
s.name, s.room_enabled , --room name
g.ip_address as gw_ip, g.is_enabled as gw_enabled, --gateway ip
h.ip_address, h.mac_address, h.is_wifi_adapter, h.is_enabled, h.net_mask, h."name" --host info (ip, mac, is wifi, mask, name)
FROM public.hosts_rels hr
INNER JOIN (select parent_id, rooms_id, rooms.is_enabled as room_enabled, rooms.name from hosts_rels 
INNER JOIN rooms ON rooms.id = hosts_rels.rooms_id
where path = 'room') s ON s.parent_id = hr.parent_id 
INNER JOIN gateways g ON g.id = hr.gateways_id
INNER JOIN hosts h ON h.id = hr.parent_id
where hr."path" = 'gateway'
            `))
        groups.rows.forEach(async group => {
            const hosts_with_same_group = hosts.rows.filter(host => host.rooms_id == group.id)
            const hosts_for_dhcp = []
            if(hosts_with_same_group[0] == undefined) {
                return
            } else {
                var gw_ip = hosts_with_same_group[0].gw_ip
                if(hosts_with_same_group[0].gw_enabled == false) gw_ip = ""
                if(hosts_with_same_group[0].room_enabled == false) return
                hosts_with_same_group.forEach(async host => {
                    if(host.is_enabled == true) hosts_for_dhcp.push(this.getHost(host.name, host.mac_address, host.ip_address))
                })
                groupsArr.push(this.getGroup(gw_ip, this.dns, hosts_for_dhcp.join("\n\n"), "\n\n" ))
            }
        });
        //return groupsArr
        return Exporter.getConfig(groupsArr.join("\n\n"))
    }
    private static getConfig(groups) {
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
    private static getGroup(gw, dns, hosts, comment = '') {
        const res = [''];
    
        if(comment.length) {
            res.push(`    #${comment}`);
        }

        if(gw == ""){
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
              }`);
        } else {
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
    }
    
        return res.join(`\n`);
    }
    private static getHost(name, mac, ip) {
        return `          host ${name} {
                hardware ethernet ${mac};
                fixed-address ${ip};
              }
              `;
    }
}