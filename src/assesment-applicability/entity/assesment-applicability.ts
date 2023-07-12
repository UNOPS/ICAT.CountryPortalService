import { Assessment } from 'src/assesment/entity/assesment.entity';
import { ApplicabilityEntity } from 'src/master-data/applicability/entity/applicability.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import {
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class AssessmentApplicability extends BaseTrackingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Assessment, { cascade: false, nullable: true })
  assessment?: Assessment;
}
