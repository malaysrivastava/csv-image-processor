import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import axios from 'axios';

@Injectable()
export class ImageService {
  async processImage(imageUrl: string): Promise<Buffer> {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    
    return sharp(buffer)
      .jpeg({ quality: 50 })
      .toBuffer();
  }
}