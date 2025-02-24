import { IsString, IsOptional } from 'class-validator';

export class UploadDto {
  @IsString()
  @IsOptional()
  webhookUrl?: string;
}