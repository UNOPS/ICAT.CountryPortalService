import { Parameter } from "src/parameter/entity/parameter.entity";

export class ChangeParameterValue{
    parameter: Parameter
    isDataEntered: boolean
    concern: string
    correctData: any
}