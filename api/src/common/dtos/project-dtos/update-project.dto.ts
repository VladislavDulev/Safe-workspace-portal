import { IsNotEmpty, IsString, Length, IsBoolean } from "class-validator";
import { Limits } from "src/common/enums/limits";

export class UpdateProjectDTO {
    @IsString()
    @Length(Limits.MIN_PROJECT_NAME_LENGTH, Limits.MAX_PROJECT_NAME_LENGTH)
    title?: string;
    
    @IsString()
    @Length(Limits.MIN_PROJECT_DESCRIPTION_LENGTH, Limits.MAX_PROJECT_DESCRIPTION_LENGTH)
    description?: string;
    
    @IsBoolean()
    isImportant?: boolean;
}