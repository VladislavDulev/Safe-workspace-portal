import { IsString, Length, IsNotEmpty } from "class-validator";
import { Limits } from "src/common/enums/limits";

export class LoginUserDTO {
    @IsString()
    @Length(Limits.MIN_USERNAME_LENGTH, Limits.MAX_USERNAME_LENGTH)
    @IsNotEmpty()
    username: string;
 
    @IsString()
    @Length(Limits.MIN_PASSWORD_LENGTH, Limits.MAX_PASSWORD_LENGTH)
    @IsNotEmpty()
    password: string;
}