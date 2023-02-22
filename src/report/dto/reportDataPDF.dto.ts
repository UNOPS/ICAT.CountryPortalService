export class ReportDataPDF {
  reportName: string;
  //executiveSummery: any;
  years: number[] = [];
  // projects: string[] = [];
  // types: string[] = [];
  sectors: string[] = [];
  climateActionIds: number[] = [];
  country = '';

  selectAllSectors = false;
  sectorIds: number[] = [];

  //Report Parameters
  projIds: string[] = [];
  assessType: string[] = [];
  yearIds: string[] = [];
  macAssecmentType: string[] = [];
  ndcIdList: string[] = [];
}
