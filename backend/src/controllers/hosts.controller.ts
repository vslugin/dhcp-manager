import { Controller, Delete, Get, Req } from '@nestjs/common';
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
  async deleteHost(@Req() request: Request) {
    
  }
}
