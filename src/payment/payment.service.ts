import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Subscription } from 'src/entities/subscription.entity';
import { SharedService } from 'src/shared/shared.service';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {

    private stripe: Stripe;
    private endpointSecret: string;
    constructor(private readonly sharedService: SharedService,
        private configService: ConfigService,
        @Inject('SUBSCRIPTION_REPOSITORY') private subscriptionRepository: Repository<Subscription>,
    ) {
        const secretKey = this.configService.get('STRIPE_SECRET_KEY');
        this.stripe = new Stripe(secretKey, { apiVersion: '2022-11-15' });
        this.endpointSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        console.log("this.endpointSecret", this.endpointSecret);
    }
    async createCheckoutSession(payload: any): Promise<any> {
        // // Đầu tiên, bạn cần lấy thông tin về hình ảnh từ cơ sở dữ liệu của ứng dụng
        // const asset = await this.sharedService.getAssetById(assetId);

        // // Tiếp theo, bạn tạo phiên thanh toán với thông tin hình ảnh và giá cả
        // const session = await this.stripe.checkout.sessions.create({
        //     payment_method_types: ['card'],
        //     line_items: [
        //         {
        //             price_data: {
        //                 currency: 'usd',
        //                 product_data: {
        //                     name: asset.assetName,
        //                     images: [asset.assetUrl],
        //                 },
        //                 unit_amount: 900 || 0,
        //             },
        //             quantity: 1,
        //         },
        //     ],
        //     mode: 'payment',
        //     success_url: 'http://localhost:7200/payment/success',
        //     cancel_url: 'http://localhost:7200',
        // });

        // return session.id;


        try {
            const customer = await this.stripe.customers.create({
                name: payload.username,
                email: payload.email,
                metadata: {
                    userId: payload.userId,
                    assetId: payload.assetId,
                }
            });

            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: payload.priceId,
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                customer: customer.id,
                success_url: 'http://staging.pomodoro.atseeds.com',
                cancel_url: 'http://staging.pomodoro.atseeds.com',
            });
            // console.log(session);

            return {
                statusCode: 200,
                data: {
                    url: session.url,
                }
            }
        } catch (error) {
            console.error(error);
            //   res.status(500).json({ error: 'An error occurred.' });
            // res.status(500).json({ error: JSON.stringify(error) });
        }


    }

    async handleSuccessfulPayment(sessionId: string, assetId: number): Promise<any> {
        // Ở đây, bạn có thể thực hiện các thao tác sau khi thanh toán thành công,
        // chẳng hạn cập nhật cơ sở dữ liệu để đánh dấu rằng hình ảnh đã được mua.
        console.log("payment success");
        return {
            message: 'Payment successful!',
        }
    }


    async getListProduct(): Promise<any> {
        const prices = await this.stripe.prices.list({ active: true });
        return {
            statusCode: 200,
            data: prices.data.reverse()
        }
    }



    async saveSubscription(customer, data): Promise<any> {
        const newSub = new Subscription();

        newSub.userId = customer.metadata.userId;
        newSub.assetId = customer.metadata.assetId;
        newSub.priceId = data.object.lines.data[0].price.id;
        newSub.createdDate = new Date().toISOString();
        if (data.object.lines.data[0].price.recurring.interval === 'month') {
            newSub.typeSubscription = 'monthly';
        } else {
            newSub.typeSubscription = 'annual';
        }
        try {
            const savedSub = await this.subscriptionRepository.save(newSub);
            console.log("Processed Order:", savedSub);
            return savedSub;
        } catch (err) {
            console.log(err);
        }
    };

    public async constructEventFromPayload(signature: string, payload: any) {
        // const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        const webhookSecret = this.endpointSecret;
        return this.stripe.webhooks.constructEvent(
            payload,
            signature,
            webhookSecret
        );
    }
    async handleEvent(event: any): Promise<any> {
        switch (event.type) {
            case 'checkout.session.completed':
                const paymentIntentSucceeded = event.data.object;
                // Then define and call a function to handle the event payment_intent.succeeded
                console.log("check checkout.session.completed", paymentIntentSucceeded);

                this.stripe.customers
                    .retrieve(event.data.object.customer)
                    .then(async (customer) => {
                        try {
                            // CREATE ORDER
                            this.saveSubscription(customer, event.data);
                        } catch (err) {
                            console.log(err);
                        }
                    })
                    .catch((err) => console.log(err.message));

                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

    }
}
