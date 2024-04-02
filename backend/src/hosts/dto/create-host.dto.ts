import { Allow, IsBoolean, IsString, IsUUID } from 'class-validator';

export class CreateHostDto {
  @Allow()
  id?: string;
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsBoolean()
  is_active: boolean;
  @IsString()
  ip_addr: string;
  @IsString()
  mac_addr: string;
  @IsUUID()
  gateway_id: string;
  @IsUUID()
  room_id: string;
}
