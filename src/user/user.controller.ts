import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  HttpCode,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  public async findOne(@Param('id') id: string, @Req() req: Request) {
    if (id != req.user['sub']) {
      throw new UnauthorizedException('Administrator privileges required');
    }
    const user = await this.userService.findOne(+id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { refreshToken, ...safeUser } = user;
    return safeUser;
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  public async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (id != req.user['sub']) {
      throw new UnauthorizedException('Administrator privileges required');
    }
    const isUser = await this.userService.findOne(+id);
    if (!isUser) {
      throw new BadRequestException('User not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, refreshToken, ...user } = updateUserDto;
    const updatedUser = await this.userService.update(+id, user);
    if (!updatedUser) {
      throw new BadRequestException('This email already exist');
    }
    return updatedUser;
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  @HttpCode(204)
  public async remove(@Param('id') id: string, @Req() req: Request) {
    if (id != req.user['sub']) {
      throw new UnauthorizedException('Administrator privileges required');
    }
    const updatedUser = await this.userService.remove(+id);
    if (!updatedUser) {
      throw new BadRequestException("User didn't delete");
    }
  }
}
