import {CollectionConfig} from "payload/types";
import { beforeDelete, checkRoomDesc, checkRoomName, checkRoomOwner } from "./hooks";


export const Rooms: CollectionConfig = {
    slug: "rooms",
    labels: {
        singular: {
            en: 'Room',
            ru: 'Кабинет',
        },
        plural: {
            en: 'Rooms',
            ru: 'Кабинеты',
        },
    },
    admin: {
        useAsTitle: 'name'
    },
    hooks: {
        beforeDelete: [beforeDelete]
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
                beforeValidate: [checkRoomName]
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
                beforeValidate: [checkRoomDesc]
            }
        },
        {
            label: {
                en: 'Owner',
                ru: 'Ответственный'
            },
            name: "owner",
            type: "text",
            hooks: {
                beforeValidate: [checkRoomOwner]
            }
        },
        {
            label: {
                en: 'Gateway',
                ru: 'Основной шлюз'
            },
            name: "gateway",
            type: "relationship",
            relationTo: 'gateways',
            hasMany: false,
            required: true
        },
        {
            label: {
                en: 'DNS Server',
                ru: 'Адрес DNS сервера'
            },
            name: "dnsServer",
            type: "relationship",
            relationTo: 'dns-servers',
            hasMany: true,
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