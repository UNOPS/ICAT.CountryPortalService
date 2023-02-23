import { Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseTrackingEntity {
  constructor() {
    this.createdBy = '-';
    this.createdOn = new Date();

    this.editedBy = '-';
    this.editedOn = new Date();
    this.status = 0;
  }

  @Column({ default: null })
  @ApiProperty()
  createdBy?: string;

  @Column({ default: null, nullable: true })
  @ApiProperty()
  createdOn?: Date;

  @Column({ default: null })
  @ApiProperty()
  editedBy: string;

  @Column({ default: null, nullable: true })
  @ApiProperty()
  editedOn?: Date;

  @Column({ default: 0 })
  @ApiProperty()
  status: RecordStatus;
}

export enum RecordStatus {
  Deleted = -20,
  InActive = -10,
  Active = 0,
}
