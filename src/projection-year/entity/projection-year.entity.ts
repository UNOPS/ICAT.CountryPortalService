import { Assessment } from 'src/assessment/entity/assessment.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'projectionYear' })
export class ProjectionYear extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: number;

  @ManyToOne(() => Assessment, (assessment) => assessment.projectionYear, {
    cascade: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  assessment: Assessment;
}
