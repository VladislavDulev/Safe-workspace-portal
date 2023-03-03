import { Controller, Body, Post, Delete, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO } from 'src/common/dtos/users-dtos/login-user.dto';

@Controller('/session')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
      ) {}

      @Post()
      async login(@Body() userDto: LoginUserDTO): Promise<{ token: string }> {
        return await this.authService.login(userDto);
      }
      
      @Delete()
      async logout(@Req() req): Promise<{ message: string}> {
        await this.authService.blacklist(req.headers.authorization?.slice(7));
    
        return {
          message: 'You have been logged out!',
        };
      }
}