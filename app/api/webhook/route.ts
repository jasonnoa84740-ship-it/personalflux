import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY est manquante.");
}

if (!webhookSecret) {
  throw new Error("STRIPE_WEBHOOK_SECRET est manquante.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia",
});

function mapPlan(priceId: string | null | undefined) {
  if (!priceId) return "FREE";

  if (priceId === process.env.STRIPE_PRICE_STARTER) return "STARTER";
  if (priceId === process.env.STRIPE_PRICE_PRO) return "PRO";
  if (priceId === process.env.STRIPE_PRICE_SCALE) return "SCALE";

  return "FREE";
}

function mapStatus(status: string | null | undefined) {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "trialing":
      return "TRIALING";
    case "past_due":
      return "PAST_DUE";
    case "canceled":
      return "CANCELED";
    default:
      return "INACTIVE";
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Signature Stripe manquante." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature error:", error);
    return NextResponse.json(
      { error: "Signature webhook invalide." },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.userId || session.client_reference_id;
        const planFromMetadata = session.metadata?.plan;
        const stripeCustomerId =
          typeof session.customer === "string" ? session.customer : null;
        const stripeSubId =
          typeof session.subscription === "string" ? session.subscription : null;

        if (!userId) {
          console.warn("checkout.session.completed sans userId");
          break;
        }

        let currentPeriodEnd: Date | null = null;
        let stripePriceId: string | null = null;
        let subscriptionStatus = "ACTIVE";

        if (stripeSubId) {
          const subscription = await stripe.subscriptions.retrieve(stripeSubId);
          currentPeriodEnd = new Date(subscription.current_period_end * 1000);
          stripePriceId = subscription.items.data[0]?.price?.id || null;
          subscriptionStatus = mapStatus(subscription.status);
        }

        await db.subscription.upsert({
          where: { userId },
          update: {
            stripeCustomerId: stripeCustomerId ?? undefined,
            stripeSubId: stripeSubId ?? undefined,
            stripePriceId: stripePriceId ?? undefined,
            plan:
              (planFromMetadata?.toUpperCase() as
                | "STARTER"
                | "PRO"
                | "SCALE"
                | undefined) ??
              (mapPlan(stripePriceId) as "FREE" | "STARTER" | "PRO" | "SCALE"),
            status: subscriptionStatus as
              | "INACTIVE"
              | "ACTIVE"
              | "PAST_DUE"
              | "CANCELED"
              | "TRIALING",
            currentPeriodEnd: currentPeriodEnd ?? undefined,
          },
          create: {
            userId,
            stripeCustomerId: stripeCustomerId ?? undefined,
            stripeSubId: stripeSubId ?? undefined,
            stripePriceId: stripePriceId ?? undefined,
            plan:
              (planFromMetadata?.toUpperCase() as
                | "STARTER"
                | "PRO"
                | "SCALE"
                | undefined) ??
              (mapPlan(stripePriceId) as "FREE" | "STARTER" | "PRO" | "SCALE"),
            status: subscriptionStatus as
              | "INACTIVE"
              | "ACTIVE"
              | "PAST_DUE"
              | "CANCELED"
              | "TRIALING",
            currentPeriodEnd: currentPeriodEnd ?? undefined,
          },
        });

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const stripeSubId = subscription.id;
        const stripeCustomerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : null;
        const stripePriceId = subscription.items.data[0]?.price?.id || null;

        await db.subscription.updateMany({
          where: {
            OR: [
              { stripeSubId },
              ...(stripeCustomerId ? [{ stripeCustomerId }] : []),
            ],
          },
          data: {
            stripePriceId: stripePriceId ?? undefined,
            plan: mapPlan(stripePriceId) as
              | "FREE"
              | "STARTER"
              | "PRO"
              | "SCALE",
            status: mapStatus(subscription.status) as
              | "INACTIVE"
              | "ACTIVE"
              | "PAST_DUE"
              | "CANCELED"
              | "TRIALING",
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const stripeSubId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : null;

        if (stripeSubId) {
          const subscription = await stripe.subscriptions.retrieve(stripeSubId);
          const stripePriceId = subscription.items.data[0]?.price?.id || null;

          await db.subscription.updateMany({
            where: { stripeSubId },
            data: {
              stripePriceId: stripePriceId ?? undefined,
              plan: mapPlan(stripePriceId) as
                | "FREE"
                | "STARTER"
                | "PRO"
                | "SCALE",
              status: mapStatus(subscription.status) as
                | "INACTIVE"
                | "ACTIVE"
                | "PAST_DUE"
                | "CANCELED"
                | "TRIALING",
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      {
        error: "Erreur traitement webhook.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}