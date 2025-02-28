import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ProcessedMetadata {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

  @Column('json')
  originalData: any;

  @Column('json', { nullable: true })
  processedData: any;

  @Column({ nullable: true })
  webhookUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}