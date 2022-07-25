import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Sector } from 'src/master-data/sector/sector.entity';
import { Methodology } from './entity/methodology.entity';

@Injectable()
export class MethodologyService extends TypeOrmCrudService<Methodology>{

    constructor(@InjectRepository(Methodology) repo) {
        super(repo);
    }

    async getMethodologyDetails(
        options: IPaginationOptions,
        filterText: string,
        countryIdFromTocken: number,
        sectorIdFromTocken: number

    ): Promise<Pagination<Methodology>> {
        let filter: string = '';

        if (filterText != null && filterText != undefined && filterText != '') {
            filter =
                'me.isActive =1 && (me.version LIKE :filterText OR me.developedBy LIKE :filterText OR me.displayName LIKE :filterText OR me.applicableSector LIKE :filterText OR sec.name LIKE :filterText OR me.documents LIKE :filterText)'
        }
        else {
            filter = 'me.isActive =1'
        }

        if (countryIdFromTocken != 0) {
            console.log('countryIdFromTocken')

            if (filter) {
                filter = `${filter}  and me.countryId = :countryIdFromTocken`;
            } else {
                filter = `me.countryId = :countryIdFromTocken`;
            }
        }

        if (sectorIdFromTocken) {
            console.log('sectorIdFromTocken')
            if (filter) {
                filter = `${filter}  and me.sectorId = :sectorIdFromTocken`;
            } else {
                filter = `me.sectorId = :sectorIdFromTocken`;
            }

        }

        let data = this.repo
            .createQueryBuilder('me')
            .leftJoinAndMapOne(
                'me.sector',
                Sector,
                'sec',
                'sec.id = me.sectorId',
            )

            .where(filter, {
                filterText: `%${filterText}%`,
                countryIdFromTocken,
                sectorIdFromTocken
            })
            .orderBy('me.createdOn', 'DESC');

        let resualt = await paginate(data, options);

        if (resualt) {
            return resualt;
        }
    }
}
