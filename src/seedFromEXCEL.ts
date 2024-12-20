import express from 'express';
import payload from 'payload';
import * as path from 'node:path';
import * as XLSX from "xlsx";
require('dotenv').config();

const app = express();

const ipsMap = {
  '144':'192',
  '145':'193',
  '146':'194',
  '147':'195',
  '148':'196',
  '149':'197',
  '150':'198',
  '151':'199'
};

const netMaskValue = '20';
const excelFilename = 'schema.xlsx';

(async () => {
    // Initialize Payload
    await payload.init({
        secret: process.env.PAYLOAD_SECRET,
        express: app,
        onInit: async () => {

            const filePath = path.join(__dirname, 'seed', 'excel_docs', excelFilename);

            console.log(`Парсится файл: '${filePath}'...`);

            const workbook = XLSX.readFile(filePath);

            const sheets = workbook.SheetNames;

            for (const sheet of sheets as any) {
                // создаём кабинеты
                const roomName = sheet;

                const gatewaysEntities = await payload.find({
                    collection: 'gateways'
                });
                const gateways = gatewaysEntities.docs;

                const dnsServerEntities = await payload.find({
                    collection: 'dns-servers'
                });
                const dnsServers = dnsServerEntities.docs;

                //
                const data = {
                    name: roomName,
                    gateway: gateways[0].id,
                    dnsServer: dnsServers[0].id
                };

                try {

                    const existEntity = await payload.find({
                        collection: 'rooms',
                        where: {
                            name: {
                                equals: data.name,
                            },
                        },
                    });

                    const isExist = existEntity?.totalDocs > 0;
                    let roomId = null;

                    if (isExist) {
                        roomId = existEntity.docs[0].id;
                        console.log(`Кабинет '${data.name}' уже существует`);
                    } else {
                        const createdRoom = await payload.create({
                            collection: 'rooms',
                            data
                        });
                        console.log(`Кабинет '${data.name}' создан`);
                        roomId = createdRoom.id;
                    }

                    // Заполняем кабинет компами
                    const worksheet = workbook.Sheets[sheet];

                    // Преобразование листа в JSON
                    const rowsWithHeaders = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 0 });

                    const isMainGateway = rowsWithHeaders[0][4] && rowsWithHeaders[0][4].trim().toLowerCase() === 'yes';
                    const gatewayName = isMainGateway ? 'main' : 'reserve';

                    const gateway: any = gateways.find((each: any) => each.name === gatewayName);

                    await payload.update({
                        collection: 'rooms',
                        id: roomId,
                        data: {
                            gateway: gateway.id
                        }
                    });

                    for (const row of rows) {

                        const values = Object.values(row);

                        const name = values[0] ? (values[0] as string).trim().toLowerCase().replaceAll('-','_') : '';
                        const ipAddress = values[2] ? (values[1] as string).trim() : '';
                        const macAddress = values[2] ? (values[2] as string).trim().toLowerCase().replaceAll('с', 'c').replaceAll('а', 'a') : '';
                        let description = values[5] ? (values[5] as string).trim().toLowerCase() : '';

                        if (
                            description.startsWith('если') ||
                            description.startsWith('yes') ||
                            description.startsWith('no')) {
                            description = '';
                        }

                        const ipAddressParts = ipAddress.split('.');
                        const ipAddressMapped = `${ipAddressParts[0]}.${ipAddressParts[1]}.${ipsMap[ipAddressParts[2]]}.${ipAddressParts[3]}`;

                        const data = {
                            name,
                            description,
                            ipAddress: ipAddressMapped,
                            netMask: netMaskValue,
                            macAddress,
                            room: roomId
                        };

                        if (data.name.length && data.ipAddress.length && data.macAddress.length === 17) {
                            // сохраняем хост
                            try {

                                const existEntity = await payload.find({
                                    collection: 'hosts',
                                    where: {
                                        name: {
                                            equals: data.name,
                                        },
                                    },
                                });

                                const isExist = existEntity.totalDocs > 0;

                                if (isExist) {
                                    console.log(`Хост '${data.name}' уже существует. Не пишем повторно`);
                                } else {
                                    const createdHost = await payload.create({
                                        collection: 'hosts',
                                        data
                                    });
                                }

                            } catch (e) {
                                console.log(`Ошибка записи хоста в базу`, e, row, data);
                               // process.exit(1);
                            }

                        } else {
                            console.log(`Подозрительный хост!`, data);
                        }
                    }

                } catch (e) {
                    console.log(`Ошибка записи кабинета в базу`, e, sheet, data);
                  //  process.exit(1);
                }

            }

            console.log('SEED FROM EXCEL IS DONE.');

            process.exit(0);
        },
    })
})();