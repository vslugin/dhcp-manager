import {CollectionBeforeDeleteHook} from "payload/types";

export const beforeDelete: CollectionBeforeDeleteHook = async (collection)=> {
    const hostsinroom = await collection.req.payload.find({
        collection: "hosts",
    })
    hostsinroom.docs = hostsinroom.docs.filter((host: any) => host.room.id == collection.id)
    if(hostsinroom.docs.length != 0){
        throw new Error("Комната не пуста!")
    }
}