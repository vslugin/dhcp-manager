import { Body, Controller, Delete, Get, Put, Query, Req } from '@nestjs/common';
import dataSource from 'src/db/data-source';
import { Gateways } from 'src/db/entity/Gateways.entity';

@Controller("gateways")
export class GateController {
  constructor() {}

  @Get()
  async getHello(): Promise<string> {
    var gateways = await Gateways.find()
    return JSON.stringify(gateways, null, 2)
  }

  @Delete()
  async deleteHost(@Body() body, @Req() request: Request): Promise<string> {
    const gaterepo = dataSource.getRepository(Gateways)
    try{
       await gaterepo.delete({ip_addr: `${body.ip_addr}` })
       return "OK"
    } catch (e){
      return e
    }
  }

  @Put()
  async addHost(@Body() body){
    const gaterepo = dataSource.getRepository(Gateways)
    try{
      var gateway = new Gateways()
      body = JSON.parse(body)
      gateway.name = body.name
      gateway.description = body.description
      gateway.ip_addr = body.ip_addr
      await Gateways.save(gateway)
      return "OK"
    } catch (e){
      console.log(e)
      return e
    }
  }
}
