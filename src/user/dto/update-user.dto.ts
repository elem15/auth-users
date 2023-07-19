import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsInt, IsOptional, Length, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsInt()
  id: number;

  @IsString()
  @Transform(({ value }) => {
    const str = value?.trim();
    if (str === '') return null;
    return str;
  })
  @IsOptional()
  @Length(3)
  name?: string;

  @IsString()
  @Transform(({ value }) => {
    const str = value?.trim();
    if (str === '') return null;
    return str;
  })
  @IsOptional()
  @Length(8)
  phone?: string;

  @IsString()
  @Transform(({ value }) => {
    const str = value?.trim();
    if (str === '') return null;
    return str;
  })
  @IsOptional()
  @Length(8)
  address?: string;

  @IsString()
  @Transform(({ value }) => {
    const str = value?.trim();
    if (str === '') return null;
    return str;
  })
  @IsOptional()
  @Length(8)
  about?: string;
}
