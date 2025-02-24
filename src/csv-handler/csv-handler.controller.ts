import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { v4 as uuid } from 'uuid';
import { CsvService } from './services/csv.service';
import { ProcessingRequest } from '../entities/processing-request.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Body } from '@nestjs/common';

@Controller('csv')
export class CsvHandlerController {
  constructor(
    private readonly csvService: CsvService,
    @InjectQueue('image-processing') private readonly imageQueue: Queue,
    @InjectRepository(ProcessingRequest)
    private readonly requestRepository: Repository<ProcessingRequest>,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('webhookUrl') webhookUrl?: string,
  ) {
    const records = await this.csvService.validateAndParse(file);
    const requestId = uuid();

    const processingRequest = this.requestRepository.create({
      id: requestId,
      status: 'PENDING',
      originalData: records,
      processedData: null,
      webhookUrl,
    });

    await this.requestRepository.save(processingRequest);

    await this.imageQueue.add('process', {
      requestId,
      data: records,
      webhookUrl,
    });

    return { requestId };
  }
}
