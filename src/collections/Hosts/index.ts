import {CollectionConfig} from "payload/types";
import {checkHostDesc, checkHostName, checkIpAddress, checkMacAddress} from "./hooks";

export const Hosts: CollectionConfig = {
    slug: "hosts",
    labels: {
        singular: {
            en: 'Host',
            ru: 'Хост',
        },
        plural: {
            en: 'Hosts',
            ru: 'Хосты',
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
                beforeValidate: [checkHostName]
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
                beforeValidate: [checkHostDesc]
            }
        },
        {
            label: {
                en: 'MAC Address',
                ru: 'MAC Адрес'
            },
            name: "macAddress",
            type: "text",
            required: true,
            hooks: {
                beforeValidate: [checkMacAddress]
            },
        },
        {
            label: {
                en: 'IP Address',
                ru: 'IP Адрес'
            },
            name: "ipAddress",
            type: "text",
            required: true,
            hooks: {
                beforeValidate: [checkIpAddress]
            },
        },
        {
            label: {
                en: 'Netmask',
                ru: 'Маска подсети'
            },
            name: "netMask",
            type: "text",
            required: true
        },
        {
            label: {
                en: 'Room',
                ru: 'Кабинет'
            },
            name: "room",
            type: "relationship",
            relationTo: 'rooms',
            hasMany: false,
            required: true
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