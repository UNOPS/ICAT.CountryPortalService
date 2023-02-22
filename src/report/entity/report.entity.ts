import { type } from 'os';
import { Assessment } from 'src/assesment/entity/assesment.entity';
import { Country } from 'src/country/entity/country.entity';
import { Ndc } from 'src/master-data/ndc/ndc.entity';
import { Sector } from 'src/master-data/sector/sector.entity';
import { Project } from 'src/project/entity/project.entity';
import { BaseTrackingEntity } from 'src/shared/entities/base.tracking.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReportAssessment } from './report-assessment.entity';
import { ReportNdc } from './report-ndc.entity';
import { ReportProject } from './report-project.entity';
import { ReportSector } from './report-sector.entity';

@Entity({ name: 'report' })
export class Report extends BaseTrackingEntity {
  constructor() {
    super();
    this.createdBy = '';
    this.editedBy = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reportName: string;

  @Column()
  savedLocation: string;

  @ManyToOne(() => Country, { cascade: false })
  country: Country;

  @OneToMany(() => ReportSector, (reportSector) => reportSector.report)
  public reportSector!: ReportSector[];

  @OneToMany(() => ReportProject, (reportProject) => reportProject.report)
  public reportProject!: ReportProject[];

  @OneToMany(
    () => ReportAssessment,
    (reportAssessment) => reportAssessment.report,
  )
  public reportAssessment!: ReportAssessment[];

  @OneToMany(() => ReportNdc, (reportNdc) => reportNdc.report)
  public reportNdc!: ReportNdc[];

  @Column({ default: null })
  description: string;

  @Column({ default: null })
  isPublish: number;

  @Column({
    default:
      'https://act.campaign.gov.uk/wp-content/uploads/sites/25/2017/02/form_icon-1.jpg',
  })
  thumbnail: string;

  // @ManyToMany((type) => Sector,{
  //     eager: true,
  //     cascade: false,
  // })
  // @JoinTable({ name: 'report_sector' })
  // sector?: Sector[];

  // @ManyToMany((type) => Ndc,{
  //     eager: true,
  //     cascade: false,
  // })
  // @JoinTable({ name: 'report_ndc' })
  // ndc?: Ndc[];

  // @ManyToMany((type) => Project,{
  //     eager: true,
  //     cascade: false,
  // })
  // @JoinTable({ name: 'report_climateaction' })
  // climateaction?: Project[];

  // @ManyToMany((type) => Assessment,{
  //     eager: true,
  //     cascade: false,
  // })
  // @JoinTable({ name: 'report_assessment' })
  // assessment?: Assessment[];
}
