import { Injectable, BadRequestException } from '@nestjs/common';
import * as csv from 'csv-parse';

@Injectable()
export class CsvService {
  async validateAndParse(file: Express.Multer.File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const records: any[] = [];
      
      csv.parse(file.buffer.toString(), {
        columns: true,
        skip_empty_lines: true,
      })
        .on('data', (record) => {
          if (!this.isValidRecord(record)) {
            reject(new BadRequestException('Invalid CSV format'));
          }
          records.push(record);
        })
        .on('end', () => resolve(records))
        .on('error', (error) => reject(error));
    });
  }

  private isValidRecord(record: any): boolean {
    return (
      record['S. No.'] &&
      record['Product Name'] &&
      record['Input Image Urls']
    );
  }
}