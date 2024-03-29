import { Allow, IsString } from 'class-validator';
export class CreateGatewayDto {
  @Allow()
  id?: string;
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString()
  ip_addr: string;
}
