import { BeforeValidateHook } from "payload/dist/globals/config/types";
import { CollectionBeforeValidateHook } from "payload/types";

var ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

var netmaskRegEx = /^[1][6-9]$|^[2][0-4]$/

var pxeFileNameRegEx = /^[а-яА-Яa-zA-Z0-9\s._-]+$/

export const beforeSettingsValidate: CollectionBeforeValidateHook = async ({data}) => {
    switch(data.key){
        case "DHCP_IP_RANGE_END":
            if(!ipRegex.test(data.value)) throw new Error("Введённое значение не похоже на IP-адрес")
            break;
        case "DHCP_IP_RANGE_BEGIN":
            if(!ipRegex.test(data.value)) throw new Error("Введённое значение не похоже на IP-адрес")
            break;
        case "DHCP_NET_PXEADDR":
            if(!ipRegex.test(data.value)) throw new Error("Введённое значение не похоже на IP-адрес")
            break;   
        case "DHCP_NET_DNS":
            if(!ipRegex.test(data.value)) throw new Error("Введённое значение не похоже на IP-адрес")
            break;        
        case "DHCP_NET_GW":
            if(!ipRegex.test(data.value)) throw new Error("Введённое значение не похоже на IP-адрес")
            break;  
        case "DHCP_NET_SUBNET":
            if(!ipRegex.test(data.value)) throw new Error("Введённое значение не похоже на IP-адрес")
            break;     
        case "DHCP_NET_MASK": 
            if(!netmaskRegEx.test(data.value)) throw new Error("Введите значение от 16 до 24")
            break; 
        case "DHCP_NET_PXEFILE":
            if(!pxeFileNameRegEx.test(data.value)) throw new Error("В имени файла PXE допустимы только буквы, цифры пробелы и дефисы!")
             break; 
    }
}