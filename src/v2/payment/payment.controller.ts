import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Post,
  RawBodyRequest,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MailingService } from 'src/v1/mailing/mailing.service';
import { UserService } from 'src/v1/user/user.service';
import { JwtAuthGuard } from 'src/v1/auth/guards/auth.jwt.guard';

@Controller('v2/payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private maillingService: MailingService,
    private userService: UserService,
  ) { }

  // @Post
  @UseGuards(JwtAuthGuard)
  @Get('getListProduct')
  async getListProduct(@Headers('User-Agent') userAgent: string) {
    console.log(
      '🚀 ~ file: payment.controller.ts:27 ~ PaymentController ~ createSubscription ~ userAgent:',
      userAgent,
    );
    return await this.paymentService.getListProduct(userAgent);
  }
  @UseGuards(JwtAuthGuard)
  @Post('createSubscription')
  async createSubscription(
    @Body() payload: any,
    @Req() req: any,
    @Headers('User-Agent') userAgent: string,
  ) {
    const { userId, email } = req.user;
    console.log("🚀 ~ file: payment.controller.ts:45 ~ PaymentController ~ req.user:", req.user)
    if (userAgent && userAgent === 'mobile') {
      try {
        const customer = null;
        // const payload = null;
        if (payload.typeSubscription === 'monthly') {
          payload.createdDate = new Date();
          payload.typeSubscription = 'month';
          payload.endDate = new Date();
          payload.endDate.setMonth(payload.createdDate.getMonth() + 1);
        }
        if (payload.typeSubscription === 'annual') {
          payload.createdDate = new Date();
          payload.endDate = new Date();
          payload.endDate.setFullYear(payload.createdDate.getFullYear() + 1);
        }
        payload.userId = userId;
        await this.paymentService.saveSubscription(customer, payload);
        const updateFields = {
          isPremium: 1,
          // currentSubscriptionId: savedSub.subscriptionId,
        };

        this.userService.updateUserFields(+payload.userId, updateFields);
        const subject = 'Pomodoro - Payment Success';
        const content =
          'Payment Success in app Pomodoro. Thank you for using our app.';
        this.maillingService.sendMail(email, subject, content);
        return {
          statusCode: 200,
          message: 'Payment Success',
        }
      } catch (err) {
        console.log(err);
        // throw new BadRequestException(err.message);
        return {
          statusCode: 500,
          error: err.message
        };
      }
    } else {
      return await this.paymentService.createCheckoutSession(payload);
    }
  }

  //webhook
  // @Post('')
  // webhook(@Req() req: RawBodyRequest<Request>) {
  //   const rawBody = req.rawBody;
  // }
  @Post('webhook')
  async handleIncomingEvents(
    @Headers('stripe-signature') sig: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!sig) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    let event;

    try {
      event = await this.paymentService.constructEventFromPayload(
        sig,
        req.rawBody,
      );
    } catch (err) {
      return {
        msg: `Webhook Error: ${err.message}`,
      };
    }

    // Handle the event
    this.paymentService.handleEvent(event);
    // Return a 200 response to acknowledge receipt of the event
    return {
      msg: 'success',
    };
  }
}
