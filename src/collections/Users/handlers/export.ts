import { sql } from 'drizzle-orm';

export const exportHandler = async (req, res, next) => {

    if(!req.user) {
        res.status(401).send({error: 'Unauthorized'});
        return;
    }

    try {

        // это нужно складывать в excel документ, затем выдавать этот документ на загрузку

        // можно получать данные прямыми SQL запросами через ORM drizzle
        const rooms = await req.payload.db.drizzle.execute(sql.raw(`SELECT * FROM rooms`));

        // можно через модельки самой Payload (см. документацию)
        const gateways = await req.payload.find({
            collection: 'gateways'
        });

        // вот тут надо отдавать не объект, а файл excel. Подключить библиотеку, сварить файл и выдать
        res.status(200).send({rooms, gateways});

    } catch (err: any) {
        res.status(500).send({ error: err });
    }
}
