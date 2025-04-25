const EOL: string = "\n";
const EOLx2: string = EOL.repeat(2);
import * as XLSX from "xlsx"
export class Exporter {

    public static async exportDHCPConfig(payload: any): Promise<string> {
        const groupsArr: any[] = [];

        const totalrooms = await payload.count({
            collection: 'rooms'
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
        const options = await getSettings(payload)
        
        //return options
        for (const group of groups.docs) {
            const hostsWithSameGroup = hosts.docs.filter((host: any) => host.room.id === group.id);
           // console.log(hostsWithSameGroup.length)
            const hostsForDhcp = [];
            if (hostsWithSameGroup.length) {
                let gwIp = group.gateway.ipAddress;
                if (!group.gateway.isEnabled) {
                    gwIp = ""
                }
                if (group.isEnabled) {
                  //  console.log("Building hosts for " + group.name)
                    hostsWithSameGroup.forEach((host: any) => {
                            hostsForDhcp.push(this.getHost(host.name, host.macAddress, host.ipAddress, host.isEnabled));
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
                options.PXE_FILENAME,
                options.PXE_ADDRESS, ));
            }
        }
        //return groupsArr
        return Exporter.getConfig(groupsArr.join(EOLx2), 
        options.DNS_SERVER, //dns
        options.DHCP_DEFAULT_GW, //gw
        options.DHCP_NET_MASK, //netmask
        options.DHCP_SUBNET, //subnet
        options.PXE_FILENAME, //pxe filename
        options.PXE_ADDRESS, // pxe ip
        options.DHCP_IP_RANGE_BEGIN, //range begin
        options.DHCP_IP_RANGE_END, // range end
    );
    }

    public static async exportToXLSX(payload: any): Promise<string> {
        const totalrooms = await payload.count({
            collection: 'rooms'
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
        let options = await getSettings(payload);
        console.log(options)
        var wb = XLSX.utils.book_new();
        //return options
        for (const group of groups.docs) {
            const hostsWithSameGroup = hosts.docs.filter((host: any) => host.room.id === group.id);
            //console.log(hostsWithSameGroup.length)
            if (hostsWithSameGroup.length) {
                var aoa_ws = []
                var isEnabled = "no"
                if(group.isEnabled) {
                    isEnabled = "yes"
                } else {
                    isEnabled = "no"
                }
               // console.log("Building hosts for " + group.name)
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

    private static getHost(name: string, mac: string, ip: string, isEnabled: boolean): string {
        if(isEnabled){
            return `          host ${name} {
                hardware ethernet ${mac};
                fixed-address ${ip};
              }
              `;
        } else {
            return ` #         host ${name} {
            #    hardware ethernet ${mac}; DISABLED HOST
            #    fixed-address ${ip};
           #   }
              `;
        }
    }
}

async function getSettings(payload: any){
    let settings = {
        DHCP_IP_RANGE_BEGIN: "1",
        DHCP_IP_RANGE_END: "1",
        DNS_SERVER: "1" ,
        PXE_FILENAME: "1",
        PXE_ADDRESS: "1",
        DHCP_DEFAULT_GW: "1",
        DHCP_NET_MASK: "1",
        DHCP_SUBNET: "1"

    }
    const totalopts= await payload.count({
        collection: 'settings'
    })
    settings.DHCP_IP_RANGE_BEGIN = (await payload.find({
        collection: 'settings',
        limit: totalopts.totalDocs,
        where: {
            key: {
                equals: "DHCP_IP_RANGE_BEGIN"
            }
        }
    })).docs[0].value
    settings.DHCP_IP_RANGE_END = (await payload.find({
        collection: 'settings',
        limit: totalopts.totalDocs,
        where: {
            key: {
                equals: "DHCP_IP_RANGE_END"
            }
        }
    })).docs[0].value

    settings.DNS_SERVER = (await payload.find({
        collection: 'settings',
        limit: totalopts.totalDocs,
        where: {
            key: {
                equals: "DHCP_NET_DNS"
            }
        }
    })).docs[0].value
    settings.PXE_FILENAME = (await payload.find({
        collection: 'settings',
        limit: totalopts.totalDocs,
        where: {
            key: {
                equals: "DHCP_NET_PXEFILE"
            }
        }
    })).docs[0].value
    settings.PXE_ADDRESS = (await payload.find({
        collection: 'settings',
        limit: totalopts.totalDocs,
        where: {
            key: {
                equals: "DHCP_NET_PXEADDR"
            }
        }
    })).docs[0].value
    settings.DHCP_DEFAULT_GW = (await payload.find({
        collection: 'settings',
        limit: totalopts.totalDocs,
        where: {
            key: {
                equals: "DHCP_NET_GW"
            }
        }
    })).docs[0].value
    settings.DHCP_NET_MASK = (await payload.find({
        collection: 'settings',
        limit: totalopts.totalDocs,
        where: {
            key: {
                equals: "DHCP_NET_MASK"
            }
        }
    })).docs[0].value
    settings.DHCP_SUBNET = (await payload.find({
        collection: 'settings',
        limit: totalopts.totalDocs,
        where: {
            key: {
                equals: "DHCP_NET_SUBNET"
            }
        }
    })).docs[0].value
    return settings
}