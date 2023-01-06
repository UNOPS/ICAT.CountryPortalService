import { Sector } from "src/master-data/sector/sector.entity";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "./report.entity";

@Entity({ name: 'reportSector' })
export class ReportSector extends BaseTrackingEntity{

    constructor() {
        super();
        this.createdBy = '';
        this.editedBy = '';
      }
 
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Report, report => report.reportSector)
    public report!: Report;

    @ManyToOne(() => Sector, sector => sector.reportSector)
    public sector!: Sector;
  

}
