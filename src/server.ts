import express from 'express'
import payload from 'payload'
import data from './seed/data'

require('dotenv').config()
const app = express()

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin')
})

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)

    //  const {users} = data;
    //   for (const user of users) {
    //     await payload.create({
    //       collection: 'users',
    //       data: user,
    //     });
    //   }

    },
  })

  // Add your own express routes here

  app.listen(8008)
}

start()
