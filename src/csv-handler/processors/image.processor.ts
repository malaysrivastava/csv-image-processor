import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ImageService } from '../services/image.service';
import { WebhookService } from '../services/webhook.service';
import { ProcessingRequest } from '../../entities/processing-request.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Processor('image-processing')
export class ImageProcessor {
  constructor(
    private readonly imageService: ImageService,
    private readonly webhookService: WebhookService,
    @InjectRepository(ProcessingRequest)
    private readonly requestRepository: Repository<ProcessingRequest>,
  ) {}

  @Process('process')
  async handleImageProcessing(job: Job) {
    const { requestId, data, webhookUrl } = job.data;

    try {
      await this.requestRepository.update(requestId, { status: 'PROCESSING' });

      const processedResults = await Promise.all(
        data.map(async (record: any) => {
          const inputUrls = record['Input Image Urls'].split(',');
          const processedUrls = await Promise.all(
            inputUrls.map(url => this.imageService.processImage(url))
          );
          
          return {
            ...record,
            'Output Image Urls': processedUrls.join(',')
          };
        })
      );

      await this.requestRepository.update(requestId, {
        status: 'COMPLETED',
        processedData: processedResults
      });

      if (webhookUrl) {
        await this.webhookService.notify(webhookUrl, {
          requestId,
          status: 'COMPLETED',
          data: processedResults,
        });
      }

      return processedResults;
    } catch (error) {
      await this.requestRepository.update(requestId, {
        status: 'FAILED',
        processedData: { error: error.message }
      });

      if (webhookUrl) {
        await this.webhookService.notify(webhookUrl, {
          requestId,
          status: 'FAILED',
          error: error.message,
        });
      }

      throw error;
    }
  }
}