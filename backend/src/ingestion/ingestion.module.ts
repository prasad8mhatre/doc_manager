import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { IngestionProcess } from './ingestion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IngestionProcess])],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}