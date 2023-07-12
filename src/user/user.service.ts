import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }
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

  public async findByName(email: string): Promise<UpdateUserDto> {
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

  public async validateUser(
    password: string,
    createUserDto: Prisma.UserCreateInput,
  ) {
    const isPasswordCorrect = await compare(password, createUserDto.password);
    if (!isPasswordCorrect) return null;
    return true;
  }

  public async generateJWT(id: number, email: string) {
    const payload = { sub: id, username: email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
