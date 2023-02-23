import { Assessment } from 'src/assesment/entity/assesment.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class AssessmentApplicability extends BaseTrackingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Assessment, { cascade: false, nullable: true })
  assessment?: Assessment;
}
