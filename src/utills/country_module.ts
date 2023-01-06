import { Injectable } from "@nestjs/common";
import { Country } from "src/country/entity/country.entity";



@Injectable()
export class CountryModule{
constructor(){

}
getModuleLevels(country:Country):number[]{
let module:number[];
   if(country.climateActionModule){
     module.push(0)
   }else{
    module.push(0)
   }




    return[]
}




}