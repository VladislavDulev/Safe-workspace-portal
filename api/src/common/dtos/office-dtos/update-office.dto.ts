import { IsString, Length } from "class-validator";
import { Limits } from "src/common/enums/limits";

export class UpdateOfficeDTO {
    @IsString()
    @Length(Limits.MIN_OFFICE_NAME_LENGTH, Limits.MAX_OFFICE_NAME_LENGTH)
    name?: string;
}