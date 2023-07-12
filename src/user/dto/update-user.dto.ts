import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmpty, IsInt, IsString, Length } from 'class-validator';

export class UpdateUserDto extends CreateUserDto {
  @IsEmpty()
  @IsInt()
  id: number;

  @IsString()
  @Length(3)
  name?: string;

  @IsString()
  @Length(8)
  phone?: string;

  @IsString()
  @Length(8)
  address?: string;

  @IsString()
  @Length(8)
  about?: string;
}
