import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { stripe } from "../../services/stripe";
import { query as qFauna} from 'faunadb'
import { fauna } from "../../services/fauna";

interface User  {
  ref: {
    id:  string;
  }
  data: {
    stripe_customer_id: string;
  }
}

export default async function (req: NextApiRequest, res: NextApiResponse){
  if (req.method === 'POST'){
    const session = getSession({req})

    const user = await fauna.query<User>(
      qFauna.Get(
        qFauna.Match(
          qFauna.Index('user_by_email'),
          qFauna.Casefold((await session).user.email)
        )
      )
    )

    let customerId =user.data.stripe_customer_id

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: (await session).user.email,
        // metadata
      })


    await fauna.query(
      qFauna.Update(
        qFauna.Ref(qFauna.Collection('users'), user.ref.id),
        {
          data: {
            stripe_customer_id: stripeCustomer.id
          }
        }
      )
    )

    customerId = stripeCustomer.id
    }

    


    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {
          price: 'price_1JoxwNDqwnjujFcjZcoob40P',
          quantity: 1
        }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id})
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
} 