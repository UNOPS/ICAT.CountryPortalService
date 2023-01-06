import {
  BaseTrackingEntity,
  RecordStatus,
} from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ParameterHistoryAction } from './paeameter-history-action-history.entity';

@Entity({ name: 'parameter_history' })
export class ParameterHistory extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  parameterName: string;

  @Column({ nullable: true })
  parameterCreatedDate: Date;

  @Column({ nullable: true })
  parameterAllocatedDate: Date;

  @Column({ nullable: true })
  parameterAssignDateByIA: Date;

  @Column({ nullable: true })
  parameterRejectDateByIA: Date;

  @Column({ nullable: true })
  Action: ParameterHistoryAction;

  @Column({ nullable: true })
  parameterId: number;

  @Column({ nullable: true })
  parameterStatus: string;

  @Column({ nullable: true })
  parameterStatusPrevious: string;

  //new cols
  @Column({ nullable: true })
  deoAssumption: string;

  @Column({ nullable: true })
  qcAssumption: string;

  @Column({ nullable: true })
  comment: string;

  @Column({ nullable: true })
  description: string;
}
