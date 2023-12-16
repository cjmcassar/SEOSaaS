import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { customerId } = req.body;

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: "price_1ONlQhLrxwiUs4snb8KzDXCU" }],
    });

    res.status(200).json({ id: subscription.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default handleRequest;
