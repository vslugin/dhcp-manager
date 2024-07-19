import {CollectionConfig} from "payload/types";


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
                en: 'Owner',
                ru: 'Ответственный'
            },
            name: "owner",
            type: "text"
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