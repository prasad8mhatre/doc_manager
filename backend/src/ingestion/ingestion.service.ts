import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngestionProcess } from './ingestion.entity';
import { TriggerIngestionDto } from './dto/trigger-ingestion.dto';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(IngestionProcess)
    private readonly ingestionRepository: Repository<IngestionProcess>,
  ) {}

  async triggerIngestion(triggerIngestionDto: TriggerIngestionDto) {
    const process = this.ingestionRepository.create(triggerIngestionDto);
    return this.ingestionRepository.save(process);
  }

  async getStatus(id: number) {
    return this.ingestionRepository.findOne({ where: { id } });
  }
}