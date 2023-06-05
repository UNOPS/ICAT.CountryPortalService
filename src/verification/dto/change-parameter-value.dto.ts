import { Parameter } from "src/parameter/entity/parameter.entity";
import { User } from "src/users/user.entity";

export class ChangeParameterValue{
    parameter: Parameter
    isDataEntered: boolean
    concern: string
    correctData: any
    user: User
}