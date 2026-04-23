import {FieldHook} from "payload/types"

export const checkGWName: FieldHook = async ({ value, collection, req}) => {
    var regEx = /^[\u0430-\u044f\u0410-\u042fa-zA-Z0-9.\s_-]+$/
    if(!regEx.test(value)){
        throw new Error('В имени допустимы только буквы (a-z) в нижнем регистре цифры и знак "_". Допустимая длина от 2 до 20 символов')
    }
}

export const checkGWIP: FieldHook = async({value,collection, req})  => {
    const regEx = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if(!regEx.test(value)) {
        throw new Error('Введённое значение не похоже на IP-адрес')
    }
}