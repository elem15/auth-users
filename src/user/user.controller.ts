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
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TokenUserDto } from './dto/token-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // @Get('profile')
  // public async getProfile(
  //   @Request() req,
  // ): Promise<Omit<UpdateUserDto, 'password'>> {
  //   const tokenUser = req.user as TokenUserDto;
  //   const userProfile = await this.userService.findOne(tokenUser.sub);
  //   if (!userProfile) throw new BadRequestException('Profile not found');
  //   return userProfile;
  // }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return await this.userService.findOne(+id);
  }

  @UsePipes(new ValidationPipe())
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const isUser = await this.userService.findOne(+id);
    if (!isUser) {
      throw new BadRequestException('User not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...user } = updateUserDto;
    return await this.userService.update(+id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
