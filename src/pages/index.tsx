import {GetStaticProps} from 'next'
import Head from 'next/head'
import { SubscribeButton } from '../components/SubscribeButton'
import styles from './home.module.scss'
import { stripe } from '../services/stripe'



interface HomeProps{
  product:{
    priceId: string;
    amount: number;
  }
}

export default function Home({product} : HomeProps) {
  return (
    <>
      <Head>
        <title>Home  | ig.news</title>
      </Head>
    <main className={styles.contentContainer}>
      <section className={styles.hero}>
        <span>👏 Hey, Welcome</span>
        <h1>News about the <span>React</span> world.</h1>
        <p>
          Get access to all the publications <br/>
          <span>for {product.amount} month</span>
        </p>
        <SubscribeButton priceId={product.priceId}/>
      </section>

      <img src="/images/avatar.svg" alt="Girl coding"/>
    </main>
    </>
  )
}
 // Client-side (Lado do cliente normal)
 // Server-side (GetServerSideProps)
 // Static Site Generation (GetStaticProps)
export const getStaticProps: GetStaticProps = async () => {
  // request via SSG (Static Site Generation)
  // GetStaticProps só pode ser usado em paginas estaticas
   // Isso é mais utilizado quando é por indexação, para ficar mais visiveis por motores de buscas
  const price = await stripe.prices.retrieve('price_1K6IIAHZvn36n3T2Qbslkk7t', {
    expand: ['product']
  })

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100), //dica sempre que for trabalhar com preços colocar em centavos pq eles sempre fica inteiro
  }
  return{
    props: {
      product,
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}
