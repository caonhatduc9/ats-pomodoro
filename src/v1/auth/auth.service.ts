import { ChangePassDto } from './dto/changePass.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserSignupDto } from './dto/auth.signup.dto';
import { User } from '../../entities/user.entity';

import * as generator from 'generate-password';
import * as bcrypt from 'bcrypt';
import { MailingService } from '../mailing/mailing.service';
import { AuthProvider } from './auth.constants';
import { log } from 'console';
import { clouddebugger } from 'googleapis/build/src/apis/clouddebugger';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private maillingService: MailingService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    console.log('check user', email, password);
    const foundUser = await this.userService.findUserByEmail(email);
    console.log('check user find', foundUser);
    if (!foundUser) {
      throw new BadRequestException('not found user');
    }
    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (foundUser && passwordMatch) {
      const { password, ...result } = foundUser;
      return result;
    }
    return null;
  }

  //local strategy login
  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
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
  async signup(userSignupDto: UserSignupDto): Promise<AuthResponse> {
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
    user.authProvider = AuthProvider.LOCAL;
    const savedUser = await this.userService.create(user);
    const subject = 'Verficiaction Code';
    const content = `<p>this is default password: <b>${randomPassword}</b>. Please change password after login</p>`;
    this.maillingService.sendMail(user.email, subject, content);
    return {
      status: 'success',
      data: {
        userId: savedUser.userId,
        access_token: '',
        userName: savedUser.username,
        avatarURL: savedUser.avatarUrl,
        payment: 'free',
      },
    };
  }

  //google strategy login
  // async googleLogin(req: any) {
  //   if (!req.user) {
  //     throw new BadRequestException('No user from google');
  //   }
  //   const foundUser = await this.userService.findUserByEmail(req.user.email);
  //   if (foundUser) {
  //     if (foundUser.authProvider !== AuthProvider.GOOGLE) {
  //       throw new BadRequestException(
  //         `email ${req.user.email} is already used by another auth provider`,
  //       );
  //     } else {
  //       const payload = { username: foundUser.username, sub: 12 };
  //       return {
  //         status: 'success',
  //         data: {
  //           userId: foundUser.userId,
  //           access_token: this.jwtService.sign(payload),
  //           userName: foundUser.username,
  //           avatarURL: foundUser.avatarUrl,
  //           payment: 'free',
  //         },
  //       };
  //     }
  //   } else {
  //     const user = new User();
  //     user.email = req.user.email;
  //     user.username = req.user.email.split('@')[0];
  //     // user.password = 'google_auth';
  //     user.avatarUrl = req.user.avatarUrl;
  //     user.isActive = 1;
  //     user.authProvider = AuthProvider.GOOGLE;
  //     const savedUser = await this.userService.create(user);
  //     const payload = { username: savedUser.username, sub: savedUser.userId };
  //     return {
  //       status: 'success',
  //       data: {
  //         userId: savedUser.userId,
  //         access_token: this.jwtService.sign(payload),
  //         userName: savedUser.username,
  //         avatarURL: savedUser.avatarUrl,
  //         payment: 'free',
  //       },
  //     };
  //   }
  // }

  async googleLogin(user: any) {
    if (!user) {
      throw new BadRequestException('No user from google');
    }
    const foundUser = await this.userService.findUserByEmail(user.email);
    if (foundUser) {
      if (foundUser.authProvider !== AuthProvider.GOOGLE) {
        throw new BadRequestException(
          `email ${user.email} is already used by another auth provider`,
        );
      } else {
        const payload = { username: foundUser.username, sub: 12 };
        return {
          status: 'success',
          data: {
            userId: foundUser.userId,
            access_token: this.jwtService.sign(payload),
            userName: foundUser.username,
            avatarURL: foundUser.avatarUrl,
            payment: 'free',
          },
        };
      }
    } else {
      const createUser = new User();
      createUser.email = user.email;
      createUser.username = user.email.split('@')[0];
      createUser.password = 'google_auth';
      createUser.avatarUrl = user.image;
      createUser.isActive = 1;
      createUser.authProvider = AuthProvider.GOOGLE;
      const savedUser = await this.userService.create(createUser);
      const payload = { username: savedUser.username, sub: savedUser.userId };
      return {
        status: 'success',
        data: {
          userId: savedUser.userId,
          access_token: this.jwtService.sign(payload),
          userName: savedUser.username,
          avatarURL: savedUser.avatarUrl,
          payment: 'free',
        },
      };
    }
  }

  async appleLogin(req: any): Promise<void> {
    console.log('applelogin servide: ', req);
  }

  async changePassword(changePassDto: ChangePassDto): Promise<any> {
    console.log('check change passs', changePassDto);
    const foundUser = await this.userService.findUserByEmail(
      changePassDto.email,
    );
    if (!foundUser) {
      throw new NotFoundException('user not exist');
    }
    //found user
    const passwordMatch = await bcrypt.compare(
      changePassDto.currentPassword,
      foundUser.password,
    );
    if (!passwordMatch) {
      throw new BadRequestException('old password incorrect');
    }
    const hashedPassword = await bcrypt.hash(changePassDto.newPassword, 10);
    const inforUpdateReturn = await this.userService.updatePasswordById(
      foundUser.userId,
      hashedPassword,
    );
    if (inforUpdateReturn.affected > 0) {
      return {
        statusCode: '200',
        message: 'success',
      };
    } else {
      throw new InternalServerErrorException();
    }
  }

  async forgotPassword(email: string): Promise<any> {
    const foundUser = await this.userService.findUserByEmail(email);
    if (!foundUser) {
      throw new NotFoundException('user not exist');
    }
    const randomPassword = generator.generate({
      length: 8,
      numbers: true,
      uppercase: true,
    });
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const subject = 'Fotgot Password';
    const content = `<p>this is default password: <b>${randomPassword}</b>. Please change password after login</p>`;
    this.maillingService.sendMail(email, subject, content);
    const inforUpdateReturn = await this.userService.updatePasswordById(
      foundUser.userId,
      hashedPassword,
    );
    if (inforUpdateReturn.affected > 0) {
      return {
        statusCode: '200',
        message: 'success',
      };
    } else {
      throw new InternalServerErrorException();
    }
  }


  //github strategy login
  // async githubLogin(req: any) {
  //   console.log('github login', req.user);
  //   if (!req.user) {
  //     throw new BadRequestException('No user from github');
  //   }
  //   const foundUser = await this.userService.findUserByEmail(req.user.email);
  //   if (foundUser) {
  //     if (foundUser.authProvider !== AuthProvider.GITHUB) {
  //       throw new BadRequestException(
  //         `email ${req.user.email} is already used by another auth provider`,
  //       );
  //     } else {
  //       const payload = { username: foundUser.username, sub: 12 };
  //       return {
  //         status: 'success',
  //         data: {
  //           userId: foundUser.userId,
  //           access_token: this.jwtService.sign(payload),
  //           userName: foundUser.username,
  //           avatarURL: foundUser.avatarUrl,
  //           payment: 'free',
  //         },
  //       };
  //     }
  //   } else {
  //     const user = new User();
  //     user.email = req.user.email;
  //     user.username = req.user.email.split('@')[0];
  //     user.password = 'github_auth';
  //     user.isActive = 1;
  //     user.authProvider = AuthProvider.GITHUB;
  //     user.avatarUrl = req.user.avatarUrl;
  //     const savedUser = await this.userService.create(user);
  //     const payload = { username: savedUser.username, sub: savedUser.userId };
  //     return {
  //       status: 'success',
  //       data: {
  //         userId: savedUser.userId,
  //         access_token: this.jwtService.sign(payload),
  //         userName: savedUser.username,
  //         avatarURL: savedUser.avatarUrl,
  //         payment: 'free',
  //       },
  //     };
  //   }
  // }
  async githubLogin(user: any) {
    console.log('github login', user);
    if (!user) {
      throw new BadRequestException('No user from github');
    }
    const foundUser = await this.userService.findUserByEmail(user.email);
    if (foundUser) {
      if (foundUser.authProvider !== AuthProvider.GITHUB) {
        throw new BadRequestException(
          `email ${user.email} is already used by another auth provider`,
        );
      } else {
        const payload = { username: foundUser.username, sub: foundUser.userId };
        return {
          status: 'success',
          data: {
            userId: foundUser.userId,
            access_token: this.jwtService.sign(payload),
            userName: foundUser.username,
            avatarURL: foundUser.avatarUrl,
            payment: 'free',
          },
        };
      }
    } else {
      const createUser = new User();
      createUser.email = user.email;
      createUser.username = user.email.split('@')[0];
      createUser.password = 'github_auth';
      createUser.isActive = 1;
      createUser.authProvider = AuthProvider.GITHUB;
      createUser.avatarUrl = user.image;
      const savedUser = await this.userService.create(createUser);
      const payload = { username: savedUser.username, sub: savedUser.userId };
      return {
        status: 'success',
        data: {
          userId: savedUser.userId,
          access_token: this.jwtService.sign(payload),
          userName: savedUser.username,
          avatarURL: savedUser.avatarUrl,
          payment: 'free',
        },
      };
    }
  }
}
