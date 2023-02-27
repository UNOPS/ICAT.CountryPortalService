import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class TokenDetails {
  constructor(@Inject(REQUEST) private request) {}

  getDetails(reqDetails: TokenReqestType[]): any[] {
    const details: any[] = [];
    const user: any = this.request.user.user;

    for (const det of reqDetails) {
      switch (det) {
        case 1:
          details.push(user.countryId);
          break;
        case 2:
          details.push(user.sectorId ? user.sectorId : 0);
          break;
        case 3:
          details.push(user.institutionId ? user.institutionId : 0);
          break;
        case 4:
          details.push(user.roles[0]);
          break;
        case 5:
          details.push(user.usr);
          break;
        case 6:
          details.push(user.moduleLevels);
          break;
        default:
      }
    }
    return details;
  }
}

export enum TokenReqestType {
  countryId = 1,
  sectorId = 2,
  InstitutionId = 3,
  role = 4,
  username = 5,
  moduleLevels = 6,
}
