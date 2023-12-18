import { Readable } from "stream";

import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: Readable): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const rawBody = await buffer(req);
    const payload = rawBody.toString("utf8");
    let event: Stripe.Event;
    let data: Stripe.Checkout.Session | Stripe.PaymentIntent;

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        req.headers["stripe-signature"] as string,
        process.env.STRIPE_WEBHOOK_SECRET as string,
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.log(`❌ Error message: ${errorMessage}`);
      return res
        .status(400)
        .json({ message: `Webhook Error: ${errorMessage}` });
    }

    switch (event.type) {
      case "checkout.session.completed":
        data = event.data.object as Stripe.Checkout.Session;
        console.log(`💰 CheckoutSession data: ${data}`);
        console.log(`💰 CheckoutSession status: ${data.payment_status}`);
        break;
      case "payment_intent.payment_failed":
        data = event.data.object as Stripe.PaymentIntent;
        console.log(`❌ Payment failed: ${data.last_payment_error?.message}`);
        break;
      case "payment_intent.succeeded":
        data = event.data.object as Stripe.PaymentIntent;
        console.log(`💰 PaymentIntent status: ${data.status}`);
        break;
      case "customer.subscription.created":
        console.log(`💰 Subscription created: ${event}`);
        break;
      case "customer.subscription.updated":
        console.log(`💰 Subscription updated: ${event}`);
        break;
      case "payment_intent.created":
        console.log(`💰 PaymentIntent created: ${event}`);
        break;
      case "invoice.created":
        console.log(`💰 Invoice created: ${event}`);
        break;
      case "invoice.finalized":
        console.log(`💰 Invoice finalized: ${event}`);
        break;
      case "invoice.updated":
        console.log(`💰 Invoice updated: ${event}`);
        break;
      case "invoice.paid":
        console.log(`💰 Invoice paid: ${event}`);
        break;
      case "invoice.payment_succeeded":
        console.log(`💰 Invoice payment succeeded: ${event}`);
        break;
      case "customer.updated":
        console.log(`💰 Customer updated: ${event}`);
        break;
      case "customer.created":
        console.log(`💰 Customer created: ${event}`);
        break;
      case "charge.succeeded":
        console.log(`💰 Charge succeeded: ${event}`);
        break;
      case "payment_method.attached":
        console.log(`💰 Payment method attached: ${event}`);
        break;
      default:
        console.log(`⚠️ Unhandled event: ${event.type}`);
        throw new Error(`Unhandled event: ${event.type}`);
    }

    return res.status(200).json({ message: "Received" });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
