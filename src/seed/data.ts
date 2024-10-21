export default {
    users: [
        {
            email: 'admin@admin.admin',
            password: 'admin'
        }
    ],
    gateways: [
        {
            name: 'main',
            ipAddress: '192.168.1.1'
        },
        {
            name: 'reserve',
            ipAddress: '192.168.1.254'
        }
    ],
    dnsServers: [
        {
            name: 'default',
            ipAddress: '8.8.8.8'
        }
    ],
    settings: [
        {
            name: 'Подсеть DHCP сервера',
            key: 'DHCP_NET_SUBNET',
            value: '192.168.1.0'
        },
        {
            name: 'Маска подсети DHCP сервера',
            key: 'DHCP_NET_MASK',
            value: '255.255.255.0'
        },
        {
            name: 'Шлюз по умолчанию, выдаваемый DHCP сервером',
            key: 'DHCP_NET_GW',
            value: '192.168.1.1'
        },
        {
            name: 'DNS сервер по умолчанию, выдаваемый DHCP сервером',
            key: 'DHCP_NET_GW',
            value: '192.168.1.1'
        },
        {
            name: 'Адрес PXE сервера',
            key: 'DHCP_NET_PXEADDR',
            value: '192.168.1.2'
        },
        {
            name: 'Файл на PXE сервере',
            key: 'DHCP_NET_PXEFILE',
            value: 'pxelinux.0'
        },
        {
            name: 'Начало диапазона выдаваемый адресов',
            key: 'DHCP_IP_RANGE_BEGIN',
            value: '192.168.1.2'
        },
        {
            name: 'Конец диапазона выдаваемый адресов',
            key: 'DHCP_IP_RANGE_END',
            value: '192.168.1.254'
        }
    ]
};