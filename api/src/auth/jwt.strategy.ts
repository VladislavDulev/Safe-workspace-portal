import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Constants } from "src/common/constants";
import { JwtPayload } from "src/common/dtos/jwt-payload/jwt-payload.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Constants.secret
    });
  }

  async validate(payload: any): Promise<JwtPayload> {
    return { sub: payload.sub, role: payload.role, username: payload.username };
  }
}