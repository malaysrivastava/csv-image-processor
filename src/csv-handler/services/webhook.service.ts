import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  async notify(webhookUrl: string, data: any): Promise<void> {
    try {
      await axios.post(webhookUrl, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000, 
      });
      
      this.logger.log(`Successfully sent webhook notification to ${webhookUrl}`);
    } catch (error) {
      this.logger.error(
        `Failed to send webhook notification to ${webhookUrl}: ${error.message}`,
        error.stack,
      );
      
      await this.retryWebhook(webhookUrl, data);
    }
  }

  private async retryWebhook(webhookUrl: string, data: any, retries = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i))); // Exponential backoff
        
        await axios.post(webhookUrl, data, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        });
        
        this.logger.log(`Successfully sent webhook notification on retry ${i + 1}`);
        return;
      } catch (error) {
        this.logger.error(
          `Retry ${i + 1} failed for webhook notification: ${error.message}`,
        );
      }
    }
    
    throw new Error(`Failed to send webhook after ${retries} retries`);
  }
}
