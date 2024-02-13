import { Body, Controller, Delete, Get, Put, Query, Req } from '@nestjs/common';
import dataSource from 'src/db/data-source';
import { Hosts } from 'src/db/entity/Hosts.entity';

@Controller("hosts")
export class HostsController {
  constructor() {}

  @Get()
  async getHello(): Promise<string> {
    var hosts = await Hosts.find()
    return JSON.stringify(hosts, null, 2)
  }

  @Delete()
  async deleteHost(@Body() body, @Req() request: Request): Promise<string> {
    const hostsrepo = dataSource.getRepository(Hosts)
    try{
       await hostsrepo.delete({ip_addr: `${body.ip_addr}` })
       return "OK"
    } catch (e){
      return e
    }
  }

  @Put()
  async addHost(@Body() body){
    const hostsrepo = dataSource.getRepository(Hosts)
    try{
      var host = new Hosts()
      body = JSON.parse(body)
      host.name = body.name
      host.description = body.description
      host.is_active = body.is_active
      host.ip_addr = body.ip_addr
      host.mac_addr = body.mac_addr
      host.gate_id = body.gate_id
      host.room_id = body.room_id
      await Hosts.save(host)
      return "OK"
    } catch (e){
      console.log(e)
      return e
    }
  }
}
