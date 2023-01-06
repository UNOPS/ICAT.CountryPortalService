import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UnitConversion extends BaseTrackingEntity {
  /**
   *
   */
  constructor() {
    super();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  fromUnit: string;

  @Column({ nullable: false })
  toUnit: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: false })
  conversionFactor: number;

  @Column({ default: null })
  uniqueIdentification: string;
}
