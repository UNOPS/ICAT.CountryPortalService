import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApplicabilityEntity } from '../applicability/entity/applicability.entity';
import { MitigationActionType } from '../mitigation-action/mitigation-action.entity';
import { Sector } from '../sector/sector.entity';

@Entity()
export class MethodologyData extends BaseTrackingEntity {
 
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    version: string;
  
    @Column()
    name: string;
  
    @Column({ default: null })
    displayName: string;
  
    @Column()
    developedBy: string;
  
    @Column({ default: null })
    parentId: number;
  
    @Column({ default: null })
    applicableSector: string;
  
    @Column()
    documents: string;
  
    @Column({ default: null })
    easenessOfDataCollection: string;
  
    @Column({ default: null })
    transportSubSector: string;
  
    @Column({ default: null })
    upstream_downstream: string;
  
    @Column({ default: null })
    ghgIncluded: string;
  
    @Column({ default: null })
    uniqueIdentification: string;
  
    @ManyToOne((type) => Sector, { cascade: false })
    @JoinColumn({ name: 'sectorId' })
    sector?: Sector;
  
    @ManyToOne((type) => MitigationActionType, { cascade: false })
    @JoinColumn({ name: 'mitigationActionTypeId' })
    mitigationActionType?: MitigationActionType;
  
    @ManyToOne((type) => ApplicabilityEntity, { cascade: false })
    @JoinColumn({ name: 'applicabilityId' })
    applicability?: ApplicabilityEntity;
  
    
}