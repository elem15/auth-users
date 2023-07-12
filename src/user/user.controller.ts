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
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserGuard } from './user.guard';
import { TokenUserDto } from './dto/token-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @UsePipes(new ValidationPipe())
  @Post('register')
  public async create(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByName(createUserDto.email);
    if (existingUser) throw new BadRequestException('User already exist');
    const user = await this.userService.create(createUserDto);
    if (!user) throw new BadRequestException('User data is incorrect');
    return user;
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  public async login(@Body() createUserDto: CreateUserDto) {
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
    const token = await this.userService.generateJWT(
      existingUser.id,
      existingUser.email,
    );
    return token;
  }

  @UseGuards(UserGuard)
  @Get('profile')
  public async getProfile(
    @Request() req,
  ): Promise<Omit<UpdateUserDto, 'password'>> {
    const tokenUser = req.user as TokenUserDto;
    const userProfile = await this.userService.findOne(tokenUser.sub);
    if (!userProfile) throw new BadRequestException('Profile not found');
    return userProfile;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...user } = updateUserDto;
    return this.userService.update(+id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
