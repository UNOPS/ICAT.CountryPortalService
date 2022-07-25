import { Controller, Get, UseGuards,Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Country } from 'src/country/entity/country.entity';
import { ProjectService } from 'src/project/project.service';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { In, Repository } from 'typeorm';
import { TrackcaEntity } from './entity/trackca.entity';
import { TrackClimateService } from './track-climate.service';

@Crud({
    model: {
      type: TrackcaEntity,
    },
    query: {
      join: {
        climateAction: {
          eager: true,
        },
    },
},
})
@Controller('track-climate')
export class TrackClimateController implements CrudController<TrackcaEntity> {
    constructor(
        public service: TrackClimateService,
        public  climateservice: ProjectService,
        private readonly tokenDetails:TokenDetails,
        // @InjectRepository(TrackcaEntity)
       // private readonly projectRepository: Repository<TrackcaEntity>,
        // public configService: ConfigService,
      ) {}
    
      get base(): CrudController<TrackcaEntity> {
        return this;
      }

      @UseGuards(JwtAuthGuard)
      @Get(
        'getTrackClimateActionDetails',
      )
      async getTrackClimateActionDetails(
        @Request() request,
        
      ): Promise<any> {
        // console.log(moment(editedOn).format('YYYY-MM-DD'))
        console.log('11111111');
    
      
        let countryIdFromTocken:number ;
        [countryIdFromTocken]=    this.tokenDetails.getDetails([TokenReqestType.countryId])
        let country=new Country()
        country.id=countryIdFromTocken
        let projects=await this.climateservice.find({select: ["id"],
        where: {country:country }    })
      let projectIdlist:number[]=[]
    projects.forEach(a=>{
      projectIdlist.push(a.id);
    })
       
    console.log('projectId',projectIdlist)
   
    
    
        return this.service.find({ where: {
          projectId: In(projectIdlist),
      },
      })
      }

}
