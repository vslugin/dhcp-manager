import { BeforeValidateHook } from "payload/dist/globals/config/types"
import { FieldHook } from "payload/types"

export const EmailCheck: BeforeValidateHook = async ({originalDoc, data}) => {
    var regEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if(!regEx.test(data.email)){
        throw new Error("Введите пожалуйста правильную почту!")
    }
}