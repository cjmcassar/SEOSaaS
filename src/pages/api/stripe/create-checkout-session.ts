import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface CustomError extends Error {
  statusCode?: number;
}

const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: "price_1OMKgqLrxwiUs4snU3ozUxaF",
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.origin}`,
        cancel_url: `${req.headers.origin}`,
      });
      if (session.url) {
        res.status(200).json({ url: session.url });
      } else {
        res.status(500).json("Session URL is null");
      }
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
