const EOL: string = "\n";
const EOLx2: string = EOL.repeat(2);
import * as XLSX from "xlsx"
export class Exporter {

    public static async exportDHCPConfig(payload: any): Promise<string> {
        const groupsArr: any[] = [];

        const totalrooms = await payload.count({
            collection: 'rooms'
        })
        const totalopts= await payload.count({
            collection: 'settings'
        })
        const totalhosts = await payload.count({
            collection: 'hosts'
        })

        const groups = await payload.find({
            collection: 'rooms',
            limit: totalrooms.totalDocs
        })
        const hosts = await payload.find({
            collection: 'hosts',
            limit: totalhosts.totalDocs
        })
        const options = await payload.find({
            collection: 'settings',
            limit: totalopts.totalDocs
        })
        
        //return options
        for (const group of groups.docs) {
            const hostsWithSameGroup = hosts.docs.filter((host: any) => host.room.id === group.id);
            console.log(hostsWithSameGroup.length)
            const hostsForDhcp = [];
            if (hostsWithSameGroup.length) {
                let gwIp = group.gateway.ipAddress;
                if (!group.gateway.isEnabled) {
                    gwIp = ""
                }
                if (group.isEnabled) {
                    console.log("Building hosts for " + group.name)
                    hostsWithSameGroup.forEach((host: any) => {
                        if (host.isEnabled) {
                            hostsForDhcp.push(this.getHost(host.name, host.macAddress, host.ipAddress));
                        }
                    });
                }
                var group_dns = ""
                group.dnsServer.forEach(dns => {
                    group_dns += `${dns.ipAddress} `
                });
                groupsArr.push(this.getGroup(gwIp, 
                group_dns, 
                hostsForDhcp.join(EOLx2), 
                group.name,    
                options.docs[2].value,
                options.docs[3].value, ));
            }
        }
        //return groupsArr
        return Exporter.getConfig(groupsArr.join(EOLx2), 
        options.docs[4].value, //dns
        options.docs[5].value, //gw
        options.docs[6].value, //netmask
        options.docs[7].value, //subnet
        options.docs[2].value, //pxe filename
        options.docs[3].value, // pxe ip
        options.docs[1].value, //range begin
        options.docs[0].value, // range end
    );
    }

    public static async exportToXLSX(payload: any): Promise<string> {
        const totalrooms = await payload.count({
            collection: 'rooms'
        })
        const totalopts= await payload.count({
            collection: 'settings'
        })
        const totalhosts = await payload.count({
            collection: 'hosts'
        })
        
        const groups = await payload.find({
            collection: 'rooms',
            limit: totalrooms.totalDocs
        })
        const hosts = await payload.find({
            collection: 'hosts',
            limit: totalhosts.totalDocs
        })
        const options = await payload.find({
            collection: 'settings',
            limit: totalopts.totalDocs
        })
        var wb = XLSX.utils.book_new();
        //return options
        for (const group of groups.docs) {
            const hostsWithSameGroup = hosts.docs.filter((host: any) => host.room.id === group.id);
            console.log(hostsWithSameGroup.length)
            if (hostsWithSameGroup.length) {
                var aoa_ws = []
                var isEnabled = "no"
                if(group.isEnabled) {
                    isEnabled = "yes"
                } else {
                    isEnabled = "no"
                }
                console.log("Building hosts for " + group.name)
                hostsWithSameGroup.forEach((host: any) => {
                    if (host.isEnabled && group.isEnabled) {
                        isEnabled = "yes"
                    } else {
                        isEnabled = "no"
                    }
                    aoa_ws.push([host.name, host.macAddress, host.ipAddress, isEnabled])
                });
                XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa_ws), group.name)
            }
        }
        XLSX.writeFileXLSX(wb, __dirname + "/generated.xlsx")
        return __dirname + "/generated.xlsx"
    }


    private static getConfig(groups: string, dns: string, gw: string, net_mask: string, subnet: string, pxe_filename: string, pxe_ip: string, begin_range: string, end_range: string): string {
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

    subnet ${subnet} netmask ${net_mask} {
    
      option routers ${gw};                              # default gateway
      option domain-name-servers ${dns};  # dns nameservers
      default-lease-time 1800;
      max-lease-time 7200;
      
      pool {
        next-server ${pxe_ip};
        filename    "${pxe_filename}";
        range ${begin_range} ${end_range};
      }
    
    }
    
    ${groups}
}`;
    }

    private static getGroup(gw: string, dns: string, hosts: string, comment: string = '', pxe_filename: string, pxe_ip: string): string {
        const res: string[] = [''];

        res.push(`    #${comment}`);

        if (!gw?.length) {
            // здесь тоже с отступами всё правильно теперь. хоть и некрасиво...
            res.push(`    group {
    option domain-name-servers ${dns};
    default-lease-time 1800;
    max-lease-time 7200;
        next-server ${pxe_ip};
        filename    "${pxe_filename}";
        
        # HOSTS BY MAC-ADDRESSES
        ${hosts}
    }`
            );
        } else {
            // и здесь тоже
            res.push(`    group {
    option routers ${gw};
    option domain-name-servers ${dns};
    default-lease-time 1800;
    max-lease-time 7200;
        next-server ${pxe_ip};
        filename    "${pxe_filename}";
        
        # HOSTS BY MAC-ADDRESSES
${hosts}
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