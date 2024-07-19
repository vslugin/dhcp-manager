import {CollectionConfig} from "payload/types";


export const Gateways: CollectionConfig = {
    slug: "gateways",
    labels: {
        singular: {
            en: 'Gateway',
            ru: 'Шлюз',
        },
        plural: {
            en: 'Gateways',
            ru: 'Шлюзы',
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
            required: true
        },
        {
            label: {
                en: 'Description',
                ru: 'Описание'
            },
            name: "description",
            type: "textarea"
        },
        {
            label: {
                en: 'IP Address',
                ru: 'IP Адрес'
            },
            name: "ipAddress",
            type: "text",
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