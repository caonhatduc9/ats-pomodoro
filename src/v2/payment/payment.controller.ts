import { BadRequestException, Body, Controller, Get, Header, Headers, Post, RawBodyRequest, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('v2/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }
  @Post('create-checkout-session')
  async createCheckoutSession(@Body() data: { assetId: number }, @Res() res) {
    const sessionId = await this.paymentService.createCheckoutSession(data.assetId);
    return res.json({ sessionId });
  }

  @Get('getListProduct')
  async getListProduct() {
    return await this.paymentService.getListProduct();
  }
  @Post('createSubscription')
  async createSubscription(@Body() payload: any) {
    return await this.paymentService.createCheckoutSession(payload);
  }

  //webhook
  // @Post('')
  // webhook(@Req() req: RawBodyRequest<Request>) {
  //   const rawBody = req.rawBody;
  // }
  @Post('webhook')
  async handleIncomingEvents(
    @Headers('stripe-signature') sig: string,
    @Req() req: RawBodyRequest<Request>
  ) {
    // if (!signature) {
    //   throw new BadRequestException('Missing stripe-signature header');
    // }
    let event;

    try {
      event = await this.paymentService.constructEventFromPayload(sig, req.rawBody);
    } catch (err) {
      return {
        msg: `Webhook Error: ${err.message}`
      }
    }

    // Handle the event
    this.paymentService.handleEvent(event);
    // Return a 200 response to acknowledge receipt of the event
    return {
      msg: 'success'
    }
  }
}
