import { IsString, IsNotEmpty, Length, IsEmail, IsEnum, } from "class-validator";
import { Limits } from "src/common/enums/limits";
import { CountryEnum } from "src/common/enums/coutries.enum";


export class CreateUserDTO {
    @IsString()
    @Length(Limits.MIN_USERNAME_LENGTH, Limits.MAX_USERNAME_LENGTH)
    @IsNotEmpty()
    username: string;

    @IsString()
    @Length(Limits.MIN_FULLNAME_LENGTH, Limits.MAX_FULLNAME_LENGTH)
    @IsNotEmpty()
    fullname: string;

    @IsNotEmpty()
    @IsEnum(CountryEnum)
    country: CountryEnum;


    @IsEmail()
    @Length(Limits.MIN_EMAIL_LENGTH, Limits.MAX_EMAIL_LENGTH)
    @IsNotEmpty()
    email: string;

    @IsString()
    @Length(Limits.MIN_PASSWORD_LENGTH, Limits.MAX_PASSWORD_LENGTH)
    @IsNotEmpty()
    password: string;

    @IsString()
    @Length(Limits.MIN_PASSWORD_LENGTH, Limits.MAX_PASSWORD_LENGTH)
    @IsNotEmpty()
    repeatpassword: string;
}