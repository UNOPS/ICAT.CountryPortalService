import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Country } from './entity/country.entity';

@Injectable()
export class CountryService extends TypeOrmCrudService<Country>{
    constructor(@InjectRepository(Country)repo){
        super(repo);
    }
}
