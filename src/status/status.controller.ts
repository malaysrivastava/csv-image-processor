import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessingRequest } from '../entities/processing-request.entity';

@Controller('status')
export class StatusController {
  constructor(
    @InjectRepository(ProcessingRequest)
    private readonly requestRepository: Repository<ProcessingRequest>,
  ) {}

  @Get(':requestId')
  async getStatus(@Param('requestId') requestId: string) {
    const request = await this.requestRepository.findOne({ where: { id: requestId } });
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    return request;
  }
}