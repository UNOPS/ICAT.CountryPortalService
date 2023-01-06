import { RecordStatus } from 'src/shared/entities/base.tracking.entity';

export class AuditDto {
  // createdBy: string;
  // createdOn: Date;
  // editedBy: string;
  // editedOn: Date;
  // status: RecordStatus;
  //id: number;
  userName: string;
  action: string;
  actionStatus: string;
  userType: string;
  //userId: number;
  comment: string;
}
