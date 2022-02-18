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
          faunaQuery.Create(faunaQuery.Collection("users"), { data: { email } })
        );
  
        return true;
      } catch {
        return false
      }
    },
  },
});
