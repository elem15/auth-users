import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @UsePipes(new ValidationPipe())
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByName(createUserDto.email);
    if (existingUser) throw new BadRequestException('User already exist');
    const user = await this.userService.create(createUserDto);
    if (!user) throw new BadRequestException('User data is incorrect');
    return user;
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByName(createUserDto.email);
    if (!existingUser) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
    const isPasswordCorrect = await this.userService.validateUser(
      createUserDto.password,
      existingUser,
    );
    if (!isPasswordCorrect)
      throw new UnauthorizedException('Email or password is incorrect');
    return createUserDto;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
