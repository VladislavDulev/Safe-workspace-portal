import { BlacklistGuard } from 'src/auth/black-list.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  Param,
  Controller,
  Post,
  ValidationPipe,
  Body,
  Delete,
  Get,
  UseGuards, Req
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from 'src/common/dtos/users-dtos/create-user.dto';
import { ResponseUserDTO } from 'src/common/dtos/users-dtos/response-user.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/common/enums/user-roles';
import { VacationDTO } from 'src/common/dtos/users-dtos/vacation.dto';
import { UserDTO } from 'src/common/dtos/users-dtos/user.dto';
import { CountryEnum } from 'src/common/enums/coutries.enum';
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  public async registerUser(
    @Body(new ValidationPipe({ whitelist: true }))
    userDto: CreateUserDTO,
  ): Promise<ResponseUserDTO> {
    return await this.userService.create(userDto);
  }

  @Get()
  async getUsers(): Promise<UserDTO[]> {
    return await this.userService.getAllUsers();
  }

  @Get('/:id')
  async getUser(@Param('id') id): Promise<UserDTO> {
    return await this.userService.getUser(+id);
  }

  @Get('/country/:countryCode')
  async getUsersFromCountry(@Param('countryCode') cCode: CountryEnum): Promise<UserDTO[]> {
    return await this.userService.getAllUsersFromCountry(cCode);
  }

  @Delete(`/:id`)
  @UseGuards(JwtAuthGuard, BlacklistGuard, new RolesGuard([UserRole.Admin]))
  async deleteUser(@Param('id') userId: string): Promise<ResponseUserDTO> {
    return await this.userService.deleteUser(+userId);
  }

  @Post(':userId/ban')
  @UseGuards(JwtAuthGuard, BlacklistGuard, new RolesGuard([UserRole.Admin]))
  async banUser(@Param('userId') userId: string): Promise<ResponseUserDTO> {
    return await this.userService.banUser(+userId);
  }

  @Post(':userId/vacation')
  @UseGuards(JwtAuthGuard, BlacklistGuard, new RolesGuard([UserRole.Admin, UserRole.Basic]))
  async vacation(@Param('userId') userId: number, @Req() req, @Body() vacation: VacationDTO): Promise<ResponseUserDTO> {
    return await this.userService.vacation(+userId, req, vacation);
  }

  @Delete(':userId/vacation')
  @UseGuards(JwtAuthGuard, BlacklistGuard, new RolesGuard([UserRole.Admin, UserRole.Basic]))
  async vacationRemove(@Param('userId') userId: number, @Req() req): Promise<ResponseUserDTO> {
    return await this.userService.vacationRemove(+userId, req);
  }
}
