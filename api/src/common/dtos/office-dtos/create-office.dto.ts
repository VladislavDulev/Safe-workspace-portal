import { CountryEnum } from "src/common/enums/coutries.enum";
import { IsEnum, IsNotEmpty, IsNumber, Min, Max, IsString, Length } from "class-validator";
import { Limits } from "src/common/enums/limits";
import { Transform } from "stream";

export class CreateOfficeDTO {
    @IsNotEmpty()
    @IsEnum(CountryEnum)
    country: CountryEnum;

    @IsNotEmpty()
    @IsNumber()
    @Min(Limits.MAX_OFFICE_DESK_PER_COL)
    @Max(Limits.MIN_OFFICE_DESK_PER_COL)
    deskPerCol: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(Limits.MIN_OFFICE_DESK_PER_ROW)
    @Max(Limits.MAX_OFFICE_DESK_PER_ROW)
    deskPerRow: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(Limits.MIN_OFFICE_ROWS)
    @Max(Limits.MAX_OFFICE_ROWS)
    rows: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(Limits.MIN_OFFICE_COLS)
    @Max(Limits.MAX_OFFICE_COLS)
    columns: number;
    
    @IsNotEmpty()
    @IsNumber()
    @Min(Limits.MIN_ROW_COL_DISTANCE)
    @Max(Limits.MAX_ROW_COL_DISTANCE)
    distanceBetweenRows: number;
    
    @IsNotEmpty()
    @IsNumber()
    @Min(Limits.MIN_ROW_COL_DISTANCE)
    @Max(Limits.MAX_ROW_COL_DISTANCE)
    distanceBetweenCols: number;
    
    @IsNotEmpty()
    @IsString()
    @Length(Limits.MIN_OFFICE_NAME_LENGTH, Limits.MAX_OFFICE_NAME_LENGTH)
    name: string;
}