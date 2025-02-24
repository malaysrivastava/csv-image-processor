import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CsvHandlerModule } from './csv-handler/csv-handler.module';
import { StatusModule } from './status/status.module';
import { ProcessingRequest } from './entities/processing-request.entity';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres', // or your database type
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [ProcessingRequest],
      ssl: {
        rejectUnauthorized: false
      },
      synchronize: true, // set to false in production
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD, // Explicitly set to null
      },
    }),CsvHandlerModule,StatusModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
