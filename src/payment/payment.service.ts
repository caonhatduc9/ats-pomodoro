import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Subscription } from 'src/entities/subscription.entity';
import { SharedService } from 'src/shared/shared.service';
import { MailingService } from 'src/v1/mailing/mailing.service';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {

    private stripe: Stripe;
    private endpointSecret: string;
    constructor(private readonly sharedService: SharedService,
        private configService: ConfigService,
        @Inject('SUBSCRIPTION_REPOSITORY') private subscriptionRepository: Repository<Subscription>,
        private maillingService: MailingService,
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
                metadata: {
                    assetId: payload.assetId,
                },
                mode: 'subscription',
                customer: customer.id,
                success_url: this.configService.get('STRIPE_SUCCESS_URL'),
                cancel_url: this.configService.get('STRIPE_CANCEL_URL'),
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
        newSub.customerId = customer.id;
        newSub.createdDate = data.createdDate;
        newSub.endDate = data.endDate;
        newSub.assetId = data.assetId;
        newSub.typeSubscription = data.typeSubscription === 'month' ? 'monthly' : 'annual';
        newSub.priceId = data.priceId;
        console.log("newSub", newSub);
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
                const dataObject = event.data.object;
                console.log("check checkout.session.completed", dataObject);
                const payload: any = {}
                const subscriptionId = dataObject.subscription;
                const subscription: any = await this.stripe.subscriptions.retrieve(subscriptionId);
                const subscriptionCreatedAt = new Date(subscription.created * 1000);
                const subscriptionExpiresAt = new Date(subscription.current_period_end * 1000);
                console.log("subscription", subscription);
                console.log("===plan", subscription.plan);
                console.log("subscriptionCreatedAt", subscriptionCreatedAt);
                console.log("subscriptionExpiresAt", subscriptionExpiresAt);

                payload.userId = dataObject.metadata.userId;
                payload.createdDate = subscriptionCreatedAt.toISOString().slice(0, 19).replace('T', ' ');
                payload.endDate = subscriptionExpiresAt.toISOString().slice(0, 19).replace('T', ' ');
                payload.assetId = dataObject.metadata.assetId;
                payload.priceId = subscription.plan.id;
                payload.typeSubscription = subscription.plan.interval;

                // const sessionWithLineItems = await this.stripe.checkout.sessions.retrieve(
                //     event.data.object.id,
                //     {
                //         expand: ['line_items'],
                //     }
                // );
                // const lineItems = sessionWithLineItems.line_items;
                // console.log("sessionWithLineItems", sessionWithLineItems);
                // console.log("lineItems", lineItems);
                // return sessionWithLineItems;
                this.stripe.customers
                    .retrieve(event.data.object.customer)
                    .then(async (customer) => {
                        try {
                            // CREATE ORDER
                            console.log("customer", customer);
                            this.saveSubscription(customer, payload);
                            const email = dataObject.customer_details.email;
                            const subject = 'Pomodoro - Payment Success';
                            const content = 'Payment Success ' + `for  ${subscription.plan.interval} Id ${subscriptionId}`;
                            this.maillingService.sendMail(email, subject, content);
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
