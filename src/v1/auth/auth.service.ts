import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserSignupDto } from './dto/auth.signup.dto';
import { User } from '../../entities/user.entity';

import * as generator from 'generate-password';
import * as bcrypt from 'bcrypt';
import { MailingService } from '../mailing/mailing.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private maillingService: MailingService,
  ) { }

  async validateUser(userName: string, pass: string): Promise<any> {
    console.log("check user", userName, pass);
    const user = await this.userService.findOne(userName);
    console.log("check user find", user);
    const passwordMatch = await bcrypt.compare(pass, user.password);
    if (user && passwordMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  //local strategy login 
  async login(user: any) {
    const payload = { username: user.username, sub: 12 };
    return {
      status: 'success',
      data: {
        userId: user.userId,
        access_token: this.jwtService.sign(payload),
        userName: user.username,
        avatarURL: user.avatarUrl,
        payment: 'free',
      },
    };
  }
  async signup(userSignupDto: UserSignupDto): Promise<AuthResponseDto> {
    const email = userSignupDto.email.toLowerCase();
    const foundUser = await this.userService.findUserByEmail(email);
    if (foundUser) {
      throw new BadRequestException('Email already exists');
    }

    const user = new User();
    user.email = userSignupDto.email.toLowerCase();
    user.username = userSignupDto.email.split('@')[0];
    const randomPassword = generator.generate({
      length: 8,
      numbers: true,
      uppercase: true,
    });
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    user.password = hashedPassword;
    console.log('password random: ', user.password);
    user.isActive = 0;
    const savedUser = await this.userService.create(user);
    const subject = 'Verficiaction Code';
    const content = `<p>this is default password: <b>${randomPassword}</b>. Please change password after login</p>`
    this.maillingService.sendMail(user.email, subject, content);
    return {
      status: 'success',
      data: {
        userId: savedUser.userId,
        apiToken: 'aschai aoshoa soihaoish',
        userName: savedUser.username,
        avatarURL: savedUser.avatarUrl,
        payment: 'free',
      },
    };
  }

  //google strategy login
  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
    return {
      message: 'User information from google',
      user: req.user,
    };
  }
}
