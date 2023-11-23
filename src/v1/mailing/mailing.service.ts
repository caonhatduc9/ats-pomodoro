import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';

// @Injectable()
// export class MailingService {
//   constructor(
//     private readonly configService: ConfigService,
//     private readonly mailerService: MailerService,
//     private readonly transporter,
//   ) {
//     this.transporter = nodemailer.createTransport({
//       host: 'something.domain.com',
//       port: 465,
//       secure: true, // Change it to false if you wanted another port than 465
//       auth: {
//         user: 'username@domain.com', // Your email address
//         pass: 'password' // Your password
//       }
//     });
//   }

//   private async setTransport() {
//     const OAuth2 = google.auth.OAuth2;
//     const oauth2Client = new OAuth2(
//       this.configService.get('CLIENT_ID'),
//       this.configService.get('CLIENT_SECRET'),
//       'https://developers.google.com/oauthplayground',
//     );

//     oauth2Client.setCredentials({
//       refresh_token: this.configService.get('REFRESH_TOKEN'),
//     });

//     const accessToken: string = await new Promise((resolve, reject) => {
//       oauth2Client.getAccessToken((err, token) => {
//         if (err) {
//           reject('Failed to create access token');
//         }
//         resolve(token);
//       });
//     });

//     const config: Options = {
//       service: 'gmail',
//       auth: {
//         type: 'OAuth2',
//         user: this.configService.get('EMAIL'),
//         clientId: this.configService.get('CLIENT_ID'),
//         clientSecret: this.configService.get('CLIENT_SECRET'),
//         accessToken,
//       },
//     };
//     this.mailerService.addTransporter('gmail', config);
//   }
//   // public async sendMail(email: string, subject: string, content: string) {
//   //   try {
//   //     await this.setTransport();
//   //     this.mailerService
//   //       .sendMail({
//   //         transporterName: 'gmail',
//   //         to: email, // list of receivers
//   //         from: 'info@atseeds.com', // sender address
//   //         subject: subject, // Subject line
//   //         // text: "Plaintext version of the message",
//   //         html: content,
//   //       })
//   //       .then((success) => {
//   //         console.log('send email success', success);
//   //       })
//   //       .catch((err) => {
//   //         console.log(err);
//   //       });
//   //   } catch (err) {
//   //     console.log(err);
//   //     // throw new Error('Send mail failed');
//   //   }
//   // }
// }

@Injectable()
export class MailingService {
  constructor(private mailerService: MailerService) { }

  async sendMail(email: string, subject: string, content: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: subject,
        template: './confirmation', // `.hbs` extension is appended automatically
        context: {
          name: email,
          content,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
}
