import { IsUUID } from 'class-validator';

export class SenseParamsDto {
  @IsUUID()
  id: string;
}
