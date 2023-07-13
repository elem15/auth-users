import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    PrismaService,
    ConfigService,
  ],
})
export class AuthModule { }
