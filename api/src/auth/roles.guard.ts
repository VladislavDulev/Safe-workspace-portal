import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from 'src/common/enums/user-roles';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(roles: UserRole[]) {
        this.roles = roles;
    }

    private roles: UserRole[];

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        const user = request.user;
        return user ? this.roles.includes(user.role) : false;
    }
}