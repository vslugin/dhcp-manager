import {CollectionConfig} from "payload/types";
import { beforeSettingsValidate } from "./hooks";

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
    hooks: {
        beforeValidate: [beforeSettingsValidate]
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
            required: true,
            admin: {
                readOnly: true
            }
        },
        {
            label: {
                en: 'Key',
                ru: 'Ключ'
            },
            name: "key",
            type: "text",
            required: true,
            admin: {
                readOnly: true
            }
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