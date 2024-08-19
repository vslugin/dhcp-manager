import { CollectionConfig } from 'payload/types'
import { exportHandler } from './handlers/export'
import { dhcpConfigHandler } from './handlers/dhcpConfig'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: {
      en: 'User',
      ru: 'Пользователь',
    },
    plural: {
      en: 'Users',
      ru: 'Пользователи',
    },
  },
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
  endpoints: [
    {
        path: '/export',
        method: 'get',
        handler: exportHandler
    },
    {
        path: '/dhcp-config',
        method: 'get',
        handler: dhcpConfigHandler
    }
]

}
