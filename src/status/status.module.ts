import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusController } from './status.controller';
import { ProcessingRequest } from '../entities/processing-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProcessingRequest]),
  ],
  controllers: [StatusController],
})
export class StatusModule {}