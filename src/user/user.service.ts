import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { compare, genSalt, hash } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  public async create(
    createUserDto: Prisma.UserCreateInput,
  ): Promise<Omit<UpdateUserDto, 'password'> | null> {
    const salt = await genSalt(10);
    const password = await hash(createUserDto.password, salt);
    try {
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password,
        },
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
    let password: string;
    if (updateUserDto.password) {
      const salt = await genSalt(10);
      password = await hash(updateUserDto.password, salt);
    }
    let data: Omit<UpdateUserDto, 'id'>;
    if (password) {
      data = {
        ...updateUserDto,
        password,
      };
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

  public async validateUser(password: string, createUserDto: CreateUserDto) {
    const isPasswordCorrect = await compare(password, createUserDto.password);
    if (!isPasswordCorrect) return null;
    return true;
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
