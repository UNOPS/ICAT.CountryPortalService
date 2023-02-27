import { Country } from 'src/country/entity/country.entity';

export class defaultValueDtos {
  parameterName: string;
  parentId: number;
  administrationLevel: string;
  source: object;
  deadLine: Date;
  year: Array<number>;
  country: Country;
}
