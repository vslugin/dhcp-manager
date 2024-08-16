import {FieldHook} from "payload/types";

const isValidHostName = (input) => {
    const regEx = /^[a-z0-9_]{2,25}$/;
    return regEx.test(input);
};

export const checkHostName: FieldHook = async ({ value, req, originalDoc }) => {

    if (!isValidHostName(value)) {
        throw new Error('В имени хоста допустимы только буквы (a-z) в нижнем регистре цифры и знак "_". Допустимая длина от 2 до 20 символов');
    }

    const isEditing = originalDoc;
    const isDuplicating = req.body?.id;

    if(isDuplicating) {

        const dflValue = 'duplicated_host';

        const existingEntity = await req.payload.find({
            collection: 'hosts',
            where: {
                name: {
                    equals: dflValue,
                },
            },
        });

        if (existingEntity.totalDocs > 0) {
            throw new Error(`Уже есть хост с именем ${dflValue}. Сначала нужно скорректировать это имя, затем можно создавать копию.`);
        }

        return dflValue;
    }

    if (isEditing) {
        if (originalDoc.name === value) {
            return value;
        }
    }

    const existingEntity = await req.payload.find({
        collection: 'hosts',
        where: {
            name: {
                equals: value,
            },
        },
    });

    if (existingEntity.totalDocs > 0) {
        throw new Error('Это имя хоста уже используется');
    }

    return value;
};

const isValidMacAddress = (input) => {
    const regEx = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
    return regEx.test(input);
};

export const checkMacAddress: FieldHook = async ({ value, req, originalDoc }) => {

    if (!isValidMacAddress(value)) {
        throw new Error('Введите корректный MAC-адрес в формате XX:XX:XX:XX:XX:XX, где X принимает шестрадцатиричное значение от 1 до F');
    }

    const isEditing = originalDoc;
    const isDuplicating = req.body?.id;

    if(isDuplicating) {

        const dflValue = '00:00:00:00:00:00';

        const existingEntity = await req.payload.find({
            collection: 'hosts',
            where: {
                macAddress: {
                    equals: dflValue,
                },
            },
        });

        if (existingEntity.totalDocs > 0) {
            throw new Error(`Уже есть хост с MAC-адресом ${dflValue}. Сначала нужно скорректировать этот адрес, затем можно создавать копию.`);
        }

        return dflValue;
    }

    if (isEditing) {
        if (originalDoc.macAddress === value) {
            return value;
        }
    }
    
    const existingEntity = await req.payload.find({
        collection: 'hosts',
        where: {
            macAddress: {
                equals: value,
            },
        },
    });

    if (existingEntity.totalDocs > 0) {
        throw new Error('Этот MAC-адрес уже используется');
    }

    return value;
};

const isValidIpAddress = (input) => {
    const regEx = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regEx.test(input);
};
export const checkIpAddress: FieldHook = async ({ value, req, originalDoc }) => {

    if (!isValidIpAddress(value)) {
        throw new Error('Введённое значение не похоже на IP-адрес');
    }

    const isEditing = originalDoc;
    const isDuplicating = req.body?.id;

    if(isDuplicating) {

        const dflValue = '0.0.0.0';

        const existingEntity = await req.payload.find({
            collection: 'hosts',
            where: {
                ipAddress: {
                    equals: dflValue,
                },
            },
        });

        if (existingEntity.totalDocs > 0) {
            throw new Error(`Уже есть хост с IP-адресом ${dflValue}. Сначала нужно скорректировать этот адрес, затем можно создавать копию.`);
        }

        return dflValue;
    }

    if (isEditing) {
        if (originalDoc.ipAddress === value) {
            return value;
        }
    }

    const existingEntity = await req.payload.find({
        collection: 'hosts',
        where: {
            ipAddress: {
                equals: value,
            },
        },
    });

    if (existingEntity.totalDocs > 0) {
        throw new Error('Этот IP-адрес уже используется');
    }

    return value;
};