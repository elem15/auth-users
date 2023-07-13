import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  // imports: [
  //   JwtModule.register({
  //     global: true,
  //     secret: process.env.SECRET,
  //     signOptions: { expiresIn: '180s' },
  //   }),
  // ],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule { }
