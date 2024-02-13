import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialDto } from './Dto/auth.credential.dto';
import { UserTypeNames } from 'src/master-data/user-type/user-type-names.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUserName(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(authCredentialDto: AuthCredentialDto): Promise<any> {
    const { username, password } = authCredentialDto;

    if (await this.usersService.validateUser(username, password)) {
      const selectedUser = await this.usersService.findByUserName(username);

      if (selectedUser.status === 0) {
        if (selectedUser.institution.status === 0) {
          if (selectedUser.country.countryStatus != 'Deactivated') {
            const payload = {
              usr: (await selectedUser).username,
              fname: selectedUser.firstName,
              lname: selectedUser.lastName,
              countryId: selectedUser.country.id,
              instName: selectedUser.institution.name,
              moduleLevels: [
                selectedUser.country.climateActionModule ? 1 : 0,
                selectedUser.country.ghgModule ? 1 : 0,
                selectedUser.country.macModule ? 1 : 0,
                selectedUser.country.dataCollectionModule ? 1 : 0,
                selectedUser.country.dataCollectionGhgModule ? 1 : 0,
              ],
              ...(![
                UserTypeNames.CountryAdmin,
                UserTypeNames.Verifier,
                UserTypeNames.InstitutionAdmin,
                UserTypeNames.DataEntryOperator,
              ].includes(selectedUser.userType.id) && {
                sectorId: selectedUser.institution.sectorId,
              }),

              ...([
                UserTypeNames.InstitutionAdmin,
                UserTypeNames.DataEntryOperator,
              ].includes(selectedUser.userType.id) && {
                institutionId: selectedUser.institution.id,
              }),

              roles: [selectedUser.userType.name],
            };

            const expiresIn = '240h';
            const token = this.jwtService.sign(payload, { expiresIn });

            return { access_token: token };
          } else {
            return { error: 'Country is deactivated' };
          }
        } else {
          return { error: 'Institution is deactivated' };
        }
      } else if (selectedUser.status === -10) {
        return { error: "Sorry. Your account has been deactivated. Please contact the user who created your account for re-activation." };
      }
    } else {
      return { error: 'Invalid credentials' };
    }
  }
}
