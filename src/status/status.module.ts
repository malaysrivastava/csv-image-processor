import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusController } from './status.controller';
import { ProcessedMetadata } from '../entities/processing-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProcessedMetadata]),
  ],
  controllers: [StatusController],
})
export class StatusModule {}