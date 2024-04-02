import { Allow, IsBoolean, IsString } from 'class-validator';

export class CreateRoomDto {
  @Allow()
  id?: string;
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsBoolean()
  is_active: boolean;
}
