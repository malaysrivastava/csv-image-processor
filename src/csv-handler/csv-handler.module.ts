import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { CsvHandlerController } from './csv-handler.controller';
import { CsvService } from './services/csv.service';
import { WebhookService } from './services/webhook.service';
import { ImageProcessor } from './processors/image.processor';
import { ImageService } from './services/image.service';
import { ProcessingRequest } from '../entities/processing-request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'image-processing',
    }),
    TypeOrmModule.forFeature([ProcessingRequest]),
  ],
  controllers: [CsvHandlerController],
  providers: [CsvService, WebhookService, ImageProcessor, ImageService],
})
export class CsvHandlerModule {}
