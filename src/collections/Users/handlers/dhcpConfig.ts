import { sql } from 'drizzle-orm';
import { Exporter } from '../utils/exporter';

export const dhcpConfigHandler = async (req, res, next) => {

    if(!req.user) {
        res.status(401).send({error: 'Unauthorized'});
        return;
    }

    try {

        // можно получать данные прямыми SQL запросами через ORM drizzle
        const rooms = await req.payload.db.drizzle.execute(sql.raw(`SELECT * FROM rooms`));

        // можно через модельки самой Payload (см. документацию)
        const hosts = await req.payload.find({
            collection: 'hosts'
        });
        const dhcpConfig = await Exporter.exportDHCPConfig(req.payload)
        // вот тут надо отдавать данные в формате plaintext (Content-Type надо поменять)
        // данные -- конфиг для dhcpd-server. Формат конфига смотри в прошлом коде, где из excel он сотворяется
        res.setHeader('content-type', 'text/plain');
        res.status(200).send(dhcpConfig);

    } catch (err: any) {
        console.log(err)
        res.status(500).send({ error: err });
    }
}