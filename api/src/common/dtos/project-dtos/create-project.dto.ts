import { IsNotEmpty, IsString, Length, IsBoolean } from "class-validator";
import { Limits } from "src/common/enums/limits";

export class CreateProjectDTO {
    @IsNotEmpty()
    @IsString()
    @Length(Limits.MIN_PROJECT_NAME_LENGTH, Limits.MAX_PROJECT_NAME_LENGTH)
    title: string;
    
    @IsNotEmpty()
    @IsString()
    @Length(Limits.MIN_PROJECT_DESCRIPTION_LENGTH, Limits.MAX_PROJECT_DESCRIPTION_LENGTH)
    description: string;
    
    @IsNotEmpty()
    @IsBoolean()
    isImportant: boolean;
}