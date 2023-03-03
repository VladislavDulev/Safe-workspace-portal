import { Module, Global } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { AuthController } from "./auth.controller";
import { Token } from "src/entities/token.entity";
import { User } from "src/entities/user.entity";
import { BlacklistGuard } from "./black-list.guard";
import { Constants } from "src/common/constants";

@Global()
@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: Constants.secret,
            signOptions: { expiresIn: '7d' },
          }),
        TypeOrmModule.forFeature([Token, User])
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, BlacklistGuard],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}