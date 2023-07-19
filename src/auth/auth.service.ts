import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import * as argon2 from 'argon2';
import { UserService } from '../user/user.service';
import { ACCESS_TOKEN_LIFE_TIME } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(authUserDto: AuthDto): Promise<any> {
    // Check if user exists
    const userExists = await this.userService.findByEmail(authUserDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const password = await argon2.hash(authUserDto.password);

    const newUser = await this.userService.create({
      ...authUserDto,
      password,
    });
    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return {
      ...tokens,
      userId: newUser.id,
      email: newUser.email,
      exp: Date.now() + ACCESS_TOKEN_LIFE_TIME * 1000,
    };
  }

  async signIn(authUserDto: AuthDto) {
    // Check if user exists
    const user = await this.userService.findByEmail(authUserDto.email);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(
      user.password,
      authUserDto.password,
    );
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      ...tokens,
      userId: user.id,
      email: user.email,
      exp: Date.now() + ACCESS_TOKEN_LIFE_TIME * 1000,
    };
  }

  async logout(userId: number) {
    return this.userService.update(userId, { refreshToken: null });
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('ACCESS_SECRET'),
          expiresIn: `${ACCESS_TOKEN_LIFE_TIME}s`,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('REFRESH_SECRET'),
          expiresIn: '3d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      ...tokens,
      userId: user.id,
      email: user.email,
      exp: Date.now() + ACCESS_TOKEN_LIFE_TIME * 1000,
    };
  }
}
