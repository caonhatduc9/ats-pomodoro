import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// import {  } from '@arendajaelu/nestjs-passport-apple';
import { ConfigService } from '@nestjs/config';
import { VerifyCallback, Strategy } from 'passport-apple';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('APPLE_CLIENTID'),
      teamID: config.get<string>('APPLE_TEAMID'),
      keyID: config.get<string>('APPLE_KEYID'),
      keyFilePath: config.get<string>('APPLE_KEYFILE_PATH'),
      callbackURL: config.get<string>('APPLE_CALLBACK'),
      passReqToCallback: false,
      scope: ['email', 'name'],
    });
    console.log('secret', config.get('APPLE_CLIENTID'));
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    idToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // Here you can do any validation or create a new user
    // based on the profile information received from Apple
    const user = {
      email: profile.email,
      firstName: profile.given_name,
      lastName: profile.family_name,
      appleId: profile.sub,
    };
    done(null, user);
  }
}
