import { Body, Controller, Get, Post, Res } from '@nestjs/common';
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
}
