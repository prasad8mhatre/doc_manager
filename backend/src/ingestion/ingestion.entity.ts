import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ingestion_processes')
export class IngestionProcess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  documentId: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'in_progress' | 'completed' | 'failed';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;
}