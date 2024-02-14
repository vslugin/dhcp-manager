import { Body, Controller, Delete, Get, Put, Query, Req } from '@nestjs/common';
import dataSource from 'src/db/data-source';
import { Rooms } from 'src/db/entity/Rooms.entity';

@Controller("gateways")
export class RoomsController {
  constructor() {}

  @Get()
  async getHello(): Promise<string> {
    var gateways = await Rooms.find()
    return JSON.stringify(gateways, null, 2)
  }

  @Delete()
  async deleteHost(@Body() body, @Req() request: Request): Promise<string> {
    const roomsrepo = dataSource.getRepository(Rooms)
    try{
       await roomsrepo.delete({id: parseInt(body.id) })
       return "OK"
    } catch (e){
      return e
    }
  }

  @Put()
  async addHost(@Body() body){
    const gaterepo = dataSource.getRepository(Rooms)
    try{
      var room = new Rooms()
      body = JSON.parse(body)
      room.name = body.name
      room.description = body.description
      room.is_active = body.is_active
      await Rooms.save(room)
      return "OK"
    } catch (e){
      console.log(e)
      return e
    }
  }
}
