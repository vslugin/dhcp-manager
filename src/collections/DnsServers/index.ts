import {CollectionConfig} from "payload/types";
import { checkDNSDesc, checkDNSIP, checkDNSName } from "./hooks";


export const DnsServers: CollectionConfig = {
    slug: "dns-servers",
    labels: {
        singular: {
            en: 'DNS Server',
            ru: 'Сервер DNS',
        },
        plural: {
            en: 'DNS Servers',
            ru: 'Серверы DNS',
        },
    },
    admin: {
        useAsTitle: 'name',
    },
    fields: [
        {
            label: {
                en: 'Name',
                ru: 'Название'
            },
            name: "name",
            type: "text",
            required: true,
            hooks: {
                beforeChange: [checkDNSName]
        }
        },
        {
            label: {
                en: 'Description',
                ru: 'Описание'
            },
            name: "description",
            type: "textarea", 
            hooks: {
             beforeChange: [checkDNSDesc]
            }
        },
        {
            label: {
                en: 'DNS Server',
                ru: 'DNS Сервер'
            },
            name: "ipAddress",
            type: "text",
            required: true,
            hooks: {
                    beforeChange: [checkDNSIP]
            }
        },
        {
            label: {
                en: 'Enabled',
                ru: 'Включён'
            },
            name: "isEnabled",
            type: "checkbox",
            required: true,
            defaultValue: true
        }
    ]
}