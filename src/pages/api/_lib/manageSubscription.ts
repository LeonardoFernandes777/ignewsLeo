import { query as q } from 'faunadb'
import { fauna } from "../../../services/fauna";
import { stripe } from '../../../services/stripe';

export async function saveSubscription(
    subscriptionId: string,
    customerId: string,
    createAction = false,
){
    // Buscar o user no banco do faunaDB com o ID { customerId }
    // E dps salvar os dados da subscription no FaunaDB

    const userRef = await fauna.query(
        q.Select(
            "ref",
            q.Get(
                q.Match(
                    q.Index('user_by_stripe_customer_id'),
                    customerId
                )
            )
        )
    )

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,
        
    }

    if (createAction) {
        // se tem um evento de criar ele cria ela normal
        await fauna.query(
            q.Create(
                q.Collection('subscriptions'),
                { data: subscriptionData}
            )
        )
    }else { // se não ele vai atualizar
    await fauna.query(
        q.Replace(
            q.Select(
                "ref",
                q.Get(
                    q.Match(
                        q.Index('subscription_by_id'),
                        subscriptionId
                    )
                )
            ),
            {data: subscriptionData }
        ),
    )
    }
}

