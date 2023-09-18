import { BadRequestException, Body, Controller, Get, Header, Headers, Post, RawBodyRequest, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('v1/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }
  @Post('create-checkout-session')
  async createCheckoutSession(@Body() data: { assetId: number }, @Res() res) {
    const sessionId = await this.paymentService.createCheckoutSession(data.assetId);
    return res.json({ sessionId });
  }

  @Post('success')
  async handleSuccessfulPayment(@Body() data: any) {
    await this.paymentService.handleSuccessfulPayment(data.sessionId, data.assetId);
    return { message: 'Payment successful!' };
  }
  // @Post('createSubscription')
  // async createSubscription(@Body() data: any) {
  //   return await this.paymentService.createSubscription(data);
  // }
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
      // event = stripe.webhooks.constructEvent();
      event = await this.paymentService.constructEventFromPayload(sig, req.rawBody);
      // console.log("event", event);
      // console.log("req.rawBody", req.rawBody);
    } catch (err) {
      // response.status(400).send(`Webhook Error: ${err.message}`);
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
    // const event = await this.stripeService.constructEventFromPayload(signature, request.rawBody);

    // if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
    //   const data = event.data.object as Stripe.Subscription;

    //   const customerId: string = data.customer as string;
    //   const subscriptionStatus = data.status;

    //   await this.usersService.updateMonthlySubscriptionStatus(customerId, subscriptionStatus)
    // }
  }
}
