import dataSource from "./data-source"
import { Hosts } from "./entity/Hosts.entity"
function initDb()  {
dataSource.initialize().then(async () => {
    const userRepository = dataSource.getRepository(Hosts)
    console.log("Inserting a new user into the database...")
    const user = new Hosts()
    user.name = "Test"
    user.description = "Saw"
    user.ip_addr = "123"
    user.gate_id = "1"
    user.mac_addr = "152"
    user.is_active = true
    user.room_id = "1"
    await user.save()
    console.log("Saved a new user with id: " + user.id)

    console.log("Loading users from the database...")
    const users = await dataSource.manager.find(Hosts)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
}
export default initDb