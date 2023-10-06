import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/auth.local.guard';
import { JwtAuthGuard } from './guards/auth.jwt.guard';
import { UserSignupDto } from './dto/auth.signup.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginValidationPipe } from './pipes/login.validate.pipe';
import { ChangePassDto } from './dto/changePass.dto';
import { log } from 'console';
import { request } from 'http';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }
  @Post('signup')
  async signup(@Body() UserSignupDto: UserSignupDto): Promise<any> {
    return this.authService.signup(UserSignupDto);
  }

  @Post('google')
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Request() req) {
  //   return HttpStatus.OK;
  // }
  async google(@Body() user: any): Promise<any> {
    console.log('BODY', user);
    return this.authService.googleLogin(user);
  }

  // @Get('google/redirect')
  // @UseGuards(AuthGuard('google'))
  // googleAuthRedirect(@Request() req) {
  //   return this.authService.googleLogin(req);
  // }

  @Post('apple')
  // @UseGuards(AuthGuard('apple'))
  async appleAuth(@Body() user: any): Promise<any> {
    console.log(
      '🚀 ~ file: auth.controller.ts:56 ~ AuthController ~ appleAuth ~ user:',
      user,
    );
    return this.authService.appleLogin(user);
  }

  @Get('apple/redirect')
  @UseGuards(AuthGuard('apple'))
  appleAuthRedirect(@Request() req: any): any {
    return this.authService.appleLogin(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any): any {
    return req.user;
  }

  @Patch('changePass')
  changePassword(@Body() changePassDto: ChangePassDto): Promise<any> {
    return this.authService.changePassword(changePassDto);
  }

  @Post('forgotPass')
  forgotPassword(@Body('email') email: string): Promise<any> {
    return this.authService.forgotPassword(email);
  }

  @Post('github')
  // @UseGuards(AuthGuard('github'))
  // async githubAuth(@Request() req) {
  //   return HttpStatus.OK;
  // }
  async githubAuth(@Body() user: any): Promise<any> {
    return this.authService.githubLogin(user);
  }

  // @Get('github/callback')
  // @UseGuards(AuthGuard('github'))
  // githubAuthRedirect(@Request() req) {
  //   return this.authService.githubLogin(req);
  // }
}
