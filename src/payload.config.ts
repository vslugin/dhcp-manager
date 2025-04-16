import path from 'path'
import {postgresAdapter} from '@payloadcms/db-postgres'
import {webpackBundler} from '@payloadcms/bundler-webpack'
import {slateEditor} from '@payloadcms/richtext-slate'
import {buildConfig} from 'payload/config'
import {Users} from './collections/Users'
import {Rooms} from "./collections/Rooms";
import {Gateways} from "./collections/Gateways";
import {Hosts} from "./collections/Hosts";
import {Settings} from "./collections/Settings";
import {DnsServers} from "./collections/DnsServers";
import MyCustomAction, { ExportDHCPConfig } from './components/exportXLSX'

export default buildConfig({
    debug: true,
    admin: {
        components: {
            actions: [MyCustomAction, ExportDHCPConfig]
        },
        disable: false,
        user: Users.slug,
        bundler: webpackBundler(),
        dateFormat: 'dd.MM.yyyy HH:mm',
        meta: {
            titleSuffix: 'DHCP Manager'
        },
    },
    editor: slateEditor({}),
    i18n: {
        fallbackLng: 'ru',
        supportedLngs: ['ru', 'en'],
    },
    collections: [Gateways, DnsServers, Rooms, Hosts, Users, Settings],
    typescript: {
        outputFile: path.resolve(__dirname, 'payload-types.ts'),
    },
    // graphQL: {
    //     schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
    // },
    plugins: [
        // payloadCloud(),
        /*nestedDocs({
            collections: ['categories'],
        }),*/
    ],
    db: postgresAdapter({
        pool: {
            connectionString: process.env.DATABASE_URI,
        },
    }),
})
