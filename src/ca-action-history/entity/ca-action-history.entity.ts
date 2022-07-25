

import { Project } from 'src/project/entity/project.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'caActionHistory' })
export class CaActionHistory extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({default:null})
  isNdcAndSubNdc: number;

  @Column({default:null})
  isApprovalAction: number;

  @Column({ default:null})
  previousNdcs: string;

  @Column({ default:null})
  currentNdcs: string;

  @Column({ default:null})
  previousSubNdcs: string;


  @Column({ default:null})
  currentSubNdcs: string;

  @Column({ default:null})
  previousAction: string;

  @Column({ default:null})
  currentAction: string;

  @Column({ default:null})
  actionUser: string;

  

  @ManyToOne(() => Project, (project) => project.caActionHistories, {
    cascade: false, nullable:true
  })
  project: Project;

  
   
}

