import { RecordStatus } from 'src/shared/entities/base.tracking.entity';

export class AuditDto {
  userName: string;
  action: string;
  actionStatus: string;
  userType: string;
  comment: string;
}
