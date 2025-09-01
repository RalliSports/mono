import { PushSubscriptionResponse } from 'src/notification/dto/webpush.dto';
import * as webpush from 'web-push';

type Payload = {
  title: string;
  body: string;
  image?: string;
  url?: string;
  icon?: string;
  tag?: string;
};

export class WebPushService {
  constructor() {
    webpush.setVapidDetails(
      'mailto:ralli-support@ralli.bet',
      process.env.VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!,
    );
  }

  async sendNotification(
    subscription: PushSubscriptionResponse,
    payload: Payload,
  ) {
    console.log(payload, subscription, 'payload');

    return await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
      },
      JSON.stringify(payload),
    );
  }
}
