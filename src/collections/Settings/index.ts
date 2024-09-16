import {CollectionConfig} from "payload/types";

export const Settings: CollectionConfig = {
    slug: "settings",
    labels: {
        singular: {
            en: 'Setting',
            ru: 'Настройка',
        },
        plural: {
            en: 'Settings',
            ru: 'Настройки',
        },
    },
    admin: {
        useAsTitle: 'name',
    },
    access: {
        create: () => false,
        delete: () => false
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
                en: 'Key',
                ru: 'Ключ'
            },
            name: "key",
            type: "text",
            required: true
        },
        {
            label: {
                en: 'Value',
                ru: 'Значение'
            },
            name: "value",
            type: "text",
            required: true
        }
    ]
}