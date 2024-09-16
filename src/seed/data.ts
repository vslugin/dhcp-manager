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
    settings: [
        {
            name: 'DHCP сервер: сеть',
            key: 'DHCP_NET_SUBNET',
            value: '192.168.1.0'
        },
        {
            name: 'DHCP сервер: маска подсети',
            key: 'DHCP_NET_MASK',
            value: '255.255.255.0'
        },
        {
            name: 'DHCP сервер: шлюз по умолчанию',
            key: 'DHCP_NET_GW',
            value: '192.168.1.1'
        },
        {
            name: 'DHCP сервер: DNS сервер по умолчанию',
            key: 'DHCP_NET_GW',
            value: '192.168.1.1'
        },
        {
            name: 'DHCP сервер: адрес PXE сервера',
            key: 'DHCP_NET_PXEADDR',
            value: '192.168.1.2'
        },
        {
            name: 'DHCP сервер: файл на PXE сервере',
            key: 'DHCP_NET_PXEFILE',
            value: 'pxelinux.0'
        }
    ]
};