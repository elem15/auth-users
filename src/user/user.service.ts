import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }
  public async create(createUserDto: Prisma.UserCreateInput) {
    const salt = genSaltSync(10);
    try {
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashSync(createUserDto.password, salt),
        },
      });
      return user;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public async findByName(email: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email },
      });
      return user;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public async findOne(id: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id },
      });
      return user;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
