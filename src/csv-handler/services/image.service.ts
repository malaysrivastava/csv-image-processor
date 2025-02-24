import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  async processImage(imageUrl: string): Promise<string> {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    const processedBuffer = await sharp(buffer) // Use sharp.default() if needed
      .jpeg({ quality: 50 })
      .toBuffer();

    const filename = `processed-${Date.now()}.jpg`;
    const filepath = path.join(__dirname, '../../../public/uploads', filename);

    fs.mkdirSync(path.dirname(filepath), { recursive: true });

    fs.writeFileSync(filepath, processedBuffer);

    return `${process.env.HOST}/uploads/${filename}`;
  }
}
