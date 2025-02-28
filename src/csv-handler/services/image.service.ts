import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import axios from 'axios';
import { S3 } from 'aws-sdk';
@Injectable()
export class ImageService {
  async processImage(imageUrl: string): Promise<string> {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    const processedBuffer = await sharp(buffer) // Use sharp.default() if needed
      .jpeg({ quality: 50 })
      .toBuffer();

    const filename = `processed-${Date.now()}.jpg`;
    const s3 = new S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
      ContentType: 'image/jpeg',
      Body: processedBuffer,
    };
    const result = await s3.upload(uploadParams).promise();

    return result.Location;
  }
}