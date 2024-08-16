import express from 'express';
import payload from 'payload';
import * as path from 'node:path';
import * as XLSX from "xlsx";
require('dotenv').config();

const app = express();

const netMaskValue = '21';
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

                // 
                const data = {
                    name: roomName,
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

                    const isExist = existEntity.totalDocs > 0;
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

                    const gatewaysEntities = await payload.find({
                        collection: 'gateways'
                    });
                    const gateways = gatewaysEntities.docs;

                    // Заполняем кабинет компами
                    const worksheet = workbook.Sheets[sheet];

                    // Преобразование листа в JSON
                    const rowsWithHeaders = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 0 });

                    const isMainGateway = rowsWithHeaders[0][4] && rowsWithHeaders[0][4].trim().toLowerCase() === 'yes';
                    const gatewayName = isMainGateway ? 'main' : 'reserve';

                    const gateway: any = gateways.find((each: any) => each.name === gatewayName);

                    for (const row of rows) {

                        const values = Object.values(row);

                        const name = values[0] ? (values[0] as string).trim().toLowerCase() : '';
                        const ipAddress = values[2] ? (values[1] as string).trim() : '';
                        const macAddress = values[2] ? (values[2] as string).trim().toLowerCase() : '';
                        let description = values[5] ? (values[5] as string).trim().toLowerCase() : '';

                        if (
                            description.startsWith('если') ||
                            description.startsWith('yes') ||
                            description.startsWith('no')) {
                            description = '';
                        }

                        const data = {
                            name,
                            description,
                            ipAddress,
                            macAddress,
                            netMask: netMaskValue,
                            gateway: gateway.id,
                            room: roomId
                        };

                        if (data.name && data.ipAddress && data.macAddress) {
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
                                process.exit(1);
                            }

                        } else {
                            console.log(`Подозрительный хост!`, data);
                        }
                    }

                } catch (e) {
                    console.log(`Ошибка записи кабинета в базу`, e, sheet, data);
                    process.exit(1);
                }

            }

            console.log('SEED FROM EXCEL IS DONE.');

            process.exit(0);
        },
    })
})();