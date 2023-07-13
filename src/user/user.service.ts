import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  public async create(
    data: Prisma.UserCreateInput,
  ): Promise<Omit<UpdateUserDto, 'password'> | null> {
    try {
      const user = await this.prisma.user.create({
        data,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...safeUser } = user;
      return safeUser;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public async update(
    id: number,
    updateUserDto: Omit<UpdateUserDto, 'id'>,
  ): Promise<Omit<UpdateUserDto, 'password'> | null> {
    let data: Omit<UpdateUserDto, 'id'>;
    if (updateUserDto.password) {
      const password = await argon2.hash(updateUserDto.password);
      data = { ...updateUserDto, password };
    } else {
      const { password: _, ...omitData } = updateUserDto;
      data = omitData;
    }
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...safeUser } = user;
      return safeUser;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public async findByEmail(email: string): Promise<CreateUserDto> {
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

  public async findOne(
    id: number,
  ): Promise<Omit<UpdateUserDto, 'password'> | null> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeUser } = user;
      return safeUser;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
