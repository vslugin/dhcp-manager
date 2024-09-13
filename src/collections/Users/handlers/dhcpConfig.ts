import {Exporter} from '../utils/exporter';

export const dhcpConfigHandler = async (req: any, res: any, next: any): Promise<void> => {

    const curlToken: string = 'fojeibae-jeo5owool7s-e0thaiweb-oo9quohhier'; // FIXME: достать токен из таблицы настроек;
    const isAccessViaCurlTokenValid = req.headers['external-curl-token'] && req.headers['external-curl-token'] === curlToken;

    if (!(isAccessViaCurlTokenValid || req.user)) {
        res.status(401).send({error: 'Unauthorized'});
        return;
    }

    try {
        const dhcpConfig = await Exporter.exportDHCPConfig(req.payload)
        res.setHeader('content-type', 'text/plain');
        res.status(200).send(dhcpConfig);
    } catch (err: any) {
        console.log(err)
        res.status(500).send({error: err});
    }
}