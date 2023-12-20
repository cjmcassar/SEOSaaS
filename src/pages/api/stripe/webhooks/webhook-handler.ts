import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
  runtime: "edge",
};

export default async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      await (await req.blob()).text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    if (err instanceof Error) console.log(err);
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    );
  }

  console.log("✅ Success:", event.id);

  const permittedEvents: string[] = [
    "checkout.session.completed",
    "payment_intent.payment_failed",
    "payment_intent.succeeded",
    "customer.subscription.created",
    "customer.subscription.updated",
    "payment_intent.created",
    "invoice.created",
    "invoice.finalized",
    "invoice.updated",
    "invoice.paid",
    "invoice.payment_succeeded",
    "customer.updated",
    "customer.created",
    "charge.succeeded",
    "payment_method.attached",
  ];

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case "checkout.session.completed":
          data = event.data.object as Stripe.Checkout.Session;
          console.log(`💰 CheckoutSession data: ${data.customer_details}`);
          console.log(`💰 CheckoutSession status: ${data.payment_status}`);

          const session = await stripe.checkout.sessions.retrieve(data.id);

          if (session.metadata) {
            // Get the profile_id from the session metadata
            const profile_id = session.metadata.profile_id;
            const customerId = session.customer;
            const customerEmail = session.customer_details?.email;
            const appUserId = session.metadata.user_id;

            console.log(`💰 Profile ID: ${profile_id}`);
            console.log("current user logged:", session.customer_details);

            // Check if the customer already exists in the database
            const { data: existingCustomer } = await supabase
              .from("customers")
              .select("*")
              .eq("stripe_id", customerId)
              .single();

            if (!existingCustomer) {
              const {
                data: uploadedStripeData,
                error,
                error: stripeSBDataError,
              } = await supabase.from("customers").insert([
                {
                  user_id: appUserId,
                  stripe_created_at: new Date(session.created * 1000),
                  stripe_id: customerId,
                  profile_id: profile_id,
                  email: customerEmail,
                  is_paid: true,
                },
              ]);

              if (error || stripeSBDataError) {
                console.error("Error inserting data: ", error);
                console.error(
                  "Error uploading stripe data:",
                  stripeSBDataError,
                );
                console.log(
                  "uploadedStripeData being sent to sb:",
                  uploadedStripeData,
                );
              }
            } else {
              console.log("⚠️ Customer already exists in the database");
            }
          } else {
            console.log("⚠️ Metadata is null");
          }

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
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Webhook handler failed" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ message: "Received" }, { status: 200 });
}
