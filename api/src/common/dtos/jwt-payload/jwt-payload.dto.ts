import { UserRole } from "src/common/enums/user-roles";

export class JwtPayload {
    sub: number;
    username: string;
    role: UserRole;
}