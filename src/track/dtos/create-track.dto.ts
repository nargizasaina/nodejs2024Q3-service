import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  artistId?: string | null;

  @IsOptional()
  @IsString()
  albumId?: string | null;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(1000)
  duration: number;
}
