import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/Usermsg";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account before logging in");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
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
    async signIn({ user, account, profile }) {
      await dbConnect();
      console.log("Sign-in callback", { user, account, profile });
      if (account?.provider === "google" || account?.provider === "github") {
        let existingUser = await UserModel.findOne({ email: profile?.email });
        let newUsername;
        if (!existingUser) {
          if (account.provider === "google") {
            const firstName = profile?.email?.split("@")[0];
            newUsername = `${firstName}gg`;
          } else if (account.provider === "github") {
            const firstName = profile?.email?.split("@")[0];
            newUsername = `${firstName}gt`;
          }
          // console.log("New user",newUsername)
          existingUser = await UserModel.create({
            email: profile?.email,
            username: newUsername,
            password: await bcrypt.hash(process.env.RANDOM_PASS!, 10),
            isVerified: true,
            isAcceptingMessages: true,
          });
        } else {
          // console.log("New user",newUsername)
          if (account.provider === "google") {
            const firstName = profile?.email?.split("@")[0];
            newUsername = `${firstName}gg`;
          } else if (account.provider === "github") {
            const firstName = profile?.email?.split("@")[0];
            newUsername = `${firstName}gt`;
          }
          await UserModel.updateOne(
            { email: profile?.email },
            {
              username: newUsername,
              password: await bcrypt.hash(process.env.RANDOM_PASS!, 10),
              isVerified: true,
              isAcceptingMessages: true,
            }
          );
        }
        // Extend the user object with additional properties
        user._id = existingUser._id;
        user.isVerified = existingUser.isVerified;
        user.isAcceptingMessages = existingUser.isAcceptingMessages;
        user.username = existingUser.username;
      }
      return true;
    },

    async jwt({ token, user }) {
      console.log("Callback jwt", { token, user });
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/dashboard`;
      } else if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};
