import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { HostsService } from './hosts.service';
import { CreateHostDto } from './dto/create-host.dto';
import { UpdateHostDto } from './dto/update-host.dto';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('hosts')
export class HostsController {
  constructor(private readonly hostsService: HostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createHostDto: CreateHostDto) {
    return this.hostsService.create(createHostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.hostsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hostsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHostDto: UpdateHostDto) {
    return this.hostsService.update(id, updateHostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hostsService.remove(id);
  }
}
