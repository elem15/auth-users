import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  id?: number;
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @Length(8)
  password: string;
}
