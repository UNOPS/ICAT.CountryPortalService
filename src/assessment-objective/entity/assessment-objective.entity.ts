import { Assessment } from 'src/assesment/entity/assesment.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'assesmentObjective' })
export class AssessmentObjective extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  objective: string;

  // @ManyToOne(() => Assessment, (assessment) => assessment.assessmentObjective, {
  //   nullable: true,
  //   cascade: false,
  //   onDelete: 'RESTRICT',
  //   onUpdate: 'RESTRICT',
  // })
  // // @JoinColumn()
  // assessment?: Assessment;

  @Column({ nullable: true })
  assessmentId: number;
}
