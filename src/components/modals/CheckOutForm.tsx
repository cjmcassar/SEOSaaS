import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Stripe,
  StripeElements,
  PaymentIntent,
  StripeError,
} from "@stripe/stripe-js";
import React, { useState, useEffect, FormEvent } from "react";

interface Message {
  message: string;
}

const CheckoutForm: React.FC = () => {
  const stripe: Stripe | null = useStripe();
  const elements: StripeElements | null = useElements();

  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret",
    );

    if (!clientSecret) {
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(
        (paymentIntentResult: {
          paymentIntent?: PaymentIntent;
          error?: StripeError;
        }) => {
          if (paymentIntentResult.error) {
            console.error(paymentIntentResult.error);
            return;
          }

          const paymentIntentResponse = paymentIntentResult.paymentIntent;
          if (paymentIntentResponse) {
            switch (paymentIntentResponse.status) {
              case "succeeded":
                setMessage({ message: "Payment succeeded!" });
                break;
              case "processing":
                setMessage({ message: "Your payment is processing." });
                break;
              case "requires_payment_method":
                setMessage({
                  message: "Your payment was not successful, please try again.",
                });
                break;
              default:
                setMessage({ message: "Something went wrong." });
                break;
            }
          }
        },
      );
  }, [stripe]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:3000",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage({ message: error.message || "An error occurred" });
    } else {
      setMessage({ message: "An unexpected error occurred." });
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message.message}</div>}
    </form>
  );
};

export default CheckoutForm;
