import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { query as faunaQuery } from "faunadb";

import { fauna } from "../../..//services/fauna";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      // authorization: "https://github.com/login/oauth/authorize?scope=read:user+user:email"
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      const { email } = user;

      try {
        await fauna.query(
          faunaQuery.If(
            faunaQuery.Not(
              faunaQuery.Exists(
                faunaQuery.Match(
                  faunaQuery.Index('user_by_email'),
                  faunaQuery.Casefold(user?.email)
                )
              )
            ),
            faunaQuery.Create(
              faunaQuery.Collection("users"), 
              { data: { email } }),
              faunaQuery.Get(
                faunaQuery.Match(
                  faunaQuery.Index('user_by_email'),
                  faunaQuery.Casefold(user?.email)
                )
              )
          )
        );

        return true;
      } catch {
        return false;
      }
    },
  },
});
