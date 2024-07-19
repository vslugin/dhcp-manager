import path from 'path'
import {postgresAdapter} from '@payloadcms/db-postgres'
import {webpackBundler} from '@payloadcms/bundler-webpack'
import {slateEditor} from '@payloadcms/richtext-slate'
import {buildConfig} from 'payload/config'
import {Users} from './collections/Users'
import {Rooms} from "./collections/Rooms";
import {Gateways} from "./collections/Gateways";
import {Hosts} from "./collections/Hosts";

export default buildConfig({
    debug: true,
    admin: {
        disable: false,
        user: Users.slug,
        bundler: webpackBundler(),
    },
    editor: slateEditor({}),
    collections: [Gateways, Rooms, Hosts, Users],
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
