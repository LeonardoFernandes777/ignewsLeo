import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { fauna } from '../../../services/fauna'
import {query as q } from 'faunadb'

export default NextAuth({
    providers: [
      GithubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }),
    ],
    callbacks: {
      async session({session}){
        try {
          const userActiveSubscription = await fauna.query<string>(
            q.Get(
              q.Intersection([
                q.Match (
                  q.Index('subscription_by_user_ref'), //buscar uma subscription pelo user ref
                  q.Select(
                    "ref",
                    q.Get( //buscar
                      q.Match( 
                        q.Index('user_by_email'), // um user 
                        q.Casefold(session.user.email)  // que der match com esse email
                      )
                    )
                  )
                ),
                q.Match(
                  q.Index('subscription_by_status'),
                  "active"
                )
              ])
            )
          )
          return {
            ...session,
            activeSubscription: userActiveSubscription
          }
        }catch {
          return {
            ...session,
            activeSubscription: null
            
          }
        }
      },

      async signIn({ user, account, profile }) {
        const { email } = user

        try{
          await fauna.query(
            q.If( // se
              q.Not( // não
                q.Exists( // existe
                  q.Match(  // igual seja um match nessa condção abaixo
                    q.Index('user_by_email'),
                    q.Casefold(user.email)
                  )
                )
              ),
              // se o user não existe eu crio ele
              q.Create(
                q.Collection('users'),
                { data: { email } }
              ),
              // se ele existe busca um user que bate com esse que nos estamos passando
              q.Get(
                q.Match( 
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            )
          )
          return true
        }catch{
          return false
        }
      },
    }
})
