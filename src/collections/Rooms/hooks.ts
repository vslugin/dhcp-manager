import {CollectionBeforeDeleteHook, FieldHook} from "payload/types";

const isValidRoomName = (input) => {
    const regEx = /^[a-z0-9_]{2,25}$/;
    return regEx.test(input);
};

const isValidRoomOwner = (input) => {
    const regEx = /^[а-яА-Яa-zA-Z0-9.\s]+$/;
    return regEx.test(input);
};

const isValidDesc = (input) => {
    const regEx = /^[а-яА-Яa-zA-Z0-9\s_-]+$/
    return regEx.test(input)
}

export const checkRoomDesc: FieldHook = async ({value, req, originalDoc}) => {
    if(value == "") {
        return ""
    } else {
    if(!isValidDesc(value)){
        throw new Error("В описании допустимы только буквы, цифры пробелы и дефисы!")
    }
}
}

export const checkRoomName: FieldHook = async ({value, req, originalDoc}) => {
    if(!isValidRoomName(value)){
        throw new Error('В имени допустимы только буквы (a-z) в нижнем регистре цифры и знак "_". Допустимая длина от 2 до 20 символов')
    }
}

export const checkRoomOwner: FieldHook = async ({value, req, originalDoc}) => {
    if(!isValidRoomOwner(value)){
        throw new Error('В поле Ответственный допустимы только буквы (a-z) в нижнем регистре цифры. Допустимая длина от 2 до 20 символов')
    }
}

export const beforeDelete: CollectionBeforeDeleteHook = async (collection)=> {
    const hostsinroom = await collection.req.payload.find({
        collection: "hosts",
    })
    hostsinroom.docs = hostsinroom.docs.filter((host: any) => host.room.id == collection.id)
    if(hostsinroom.docs.length != 0){
        throw new Error("Пожалуйста удалите всех хостов из кабинета перед тем как удалять комнату!")
    }
}