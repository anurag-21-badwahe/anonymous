import mongoose from "mongoose";
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import User from "@/modals/User";
import connectDB from "@/db/connectDb";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: any) {
      if (account?.provider === "github" || account?.provider === "google") {
        try {
          await connectDB();

          // Find or create the user in the database
          let dbUser = await User.findOne({ email: email });

          if (!dbUser) {
            dbUser = await User.create({
              email: user.email,
              username: user?.email.split("@")[0],
            });
          }

          // Set user name in session
          user.name = dbUser.username;
        } catch (error) {
          // Handle error
          console.error("Error:", error);
        }
        return true;
      }
    },
    async session({ session, token, user }) {
      try {
        await connectDB();

        if (session && session.user && session.user.email) {
          // Find the user in the database
          const dbUser = await User.findOne({ email: session.user.email });

          if (dbUser) {
            // Set user name in session
            session.user.name = dbUser.username;
          }
        }
      } catch (error) {
        // Handle error
        console.error("Error:", error);
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
