import express from 'express';
import payload from 'payload';
import data from './seed/data';
require('dotenv').config();

const app = express();

(async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {

      // users
      const { users } = data;
      for (const user of users) {
        await payload.create({
          collection: 'users',
          data: user,
        });
      }

      // gateways
      const { gateways } = data;
      for (const gw of gateways) {
        await payload.create({
          collection: 'gateways',
          data: gw,
        });
      }

      // settings
      const { settings } = data;
      for (const sett of settings) {
        await payload.create({
          collection: 'settings',
          data: sett,
        });
      }

      console.log('SEED IS DONE.');
      process.exit(0);
    },
  })
})();