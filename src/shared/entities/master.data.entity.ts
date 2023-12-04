import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTrackingEntity } from './base.tracking.entity';

export abstract class MasterData extends BaseTrackingEntity {
  constructor() {
    super();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ length: 2500, default: null })
  description: string;

  @Column({ default: 1 })
  sortOrder: number;
}
