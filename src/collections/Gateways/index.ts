import {CollectionConfig} from "payload/types";
import { checkGWDesc, checkGWIP, checkGWName } from "./hooks";


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
            required: true,
            hooks: {
                beforeValidate: [checkGWName]
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
                beforeValidate: [checkGWDesc]
            }
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
                beforeValidate: [checkGWIP]
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