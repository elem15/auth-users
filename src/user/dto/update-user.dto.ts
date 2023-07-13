import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsInt, IsOptional, Length } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsInt()
  id: number;
  @IsOptional()
  @Length(3)
  name?: string;
  @IsOptional()
  @Length(8)
  phone?: string;
  @IsOptional()
  @Length(8)
  address?: string;
  @IsOptional()
  @Length(8)
  about?: string;
}
