import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessedMetadata } from '../entities/processing-request.entity';

@Controller('status')
export class StatusController {
  constructor(
    @InjectRepository(ProcessedMetadata)
    private readonly requestRepository: Repository<ProcessedMetadata>,
  ) {}

  @Get()
  async getStatus(@Query('requestId') requestId: string) {
    if (!requestId) {
      throw new NotFoundException('Request ID is required');
    }

    const request = await this.requestRepository.findOne({ where: { id: requestId } });
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    return request;
  }
}
