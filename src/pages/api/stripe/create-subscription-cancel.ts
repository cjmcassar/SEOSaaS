import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface CustomError extends Error {
  statusCode?: number;
}

const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { customerId, subscriptionId } = req.body;

    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${req.headers.origin}`,
        flow_data: {
          type: "subscription_cancel",
          subscription_cancel: {
            subscription: subscriptionId,
          },
        },
      });

      res.status(200).json({ url: session.url });
    } catch (err) {
      const error = err as CustomError;
      res.status(error.statusCode || 500).json(error.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default handleRequest;
