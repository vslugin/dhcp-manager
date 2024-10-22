import { sql } from 'drizzle-orm';
import { Exporter } from '../utils/exporter';
export const exportHandler = async (req, res, next) => {

    if(!req.user) {
        res.status(401).send({error: 'Unauthorized'});
        return;
    }

    try {

        // это нужно складывать в excel документ, затем выдавать этот документ на загрузку

        // можно через модельки самой Payload (см. документацию)
        const gateways = await req.payload.find({
            collection: 'settings'
        });
        // вот тут надо отдавать не объект, а файл excel. Подключить библиотеку, сварить файл и выдать
        //res.status(200).send({gateways});
        var file_path = await Exporter.exportToXLSX(req.payload)
        res.status(200).download(file_path, "generated.xlsx");
    } catch (err: any) {
        console.log(err)
        res.status(500).send({ error: err });
    }
}
