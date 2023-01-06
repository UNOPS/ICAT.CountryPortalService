import { Project } from "src/project/entity/project.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'trackClimateAction' })
export class TrackcaEntity extends BaseTrackingEntity{


    constructor() {
        super();
        this.createdBy = '';
        this.editedBy = '';
      }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    climateActionName: string;

    @Column({ default: null })
    description: string;
 
    @Column({ length: 500, default: null, nullable: true })
    objective: string;

    @Column({ default: null })
    trackcaStatus: string;

    @Column({ default: null })
    sector: string;

    @Column({ default: null })
    gassesAffected: string;

    @Column({ default: null })
    ndcs: string;

    @Column({ default: null })
    startYearImplementation: number;

    @Column({ default: null })
    achieved: number;

    @Column({ default: null })
    expected: number;
    
    // @OneToOne(() => Project)
    // @JoinColumn()
    // climateAction: Project;

    @Column({ default: null })
    years: string;

    @Column({ default: null })
    instrument: string;

    
    @Column({ default: null })
    implementingEntities: string; //institution

    @Column({ default: null })
    flag: number;

    @Column({ nullable: true })
    projectId: number;
}
