export class UpdateDeadlineDto {
  ids?: number[];
  deadline?: Date;
  status?: number;
  userId?: number;
  comment?: string;
  verificationStatus?: number
}
