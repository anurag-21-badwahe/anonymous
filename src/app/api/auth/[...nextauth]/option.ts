import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/Usermsg";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

// Extend the default NextAuth JWT interface to include custom fields
declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
    name?:string;
    image?:string;
    user?:string;
    email?:string;
    accessToken?: string;
    githubToken?: string;
    googleToken?: string;
  }
}

// Extend the default NextAuth Session interface to include custom fields
declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      isVerified: boolean;
      name?:string;
      image?:string;
      user?:string;
      email?:string;
      isAcceptingMessages: boolean;
      username: string;
    };
    accessToken?: string;
    githubToken?: string;
    googleToken?: string;
  }
}

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
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id!;
        session.user.isVerified = token.isVerified!;
        session.user.isAcceptingMessages = token.isAcceptingMessages!;
        session.user.username = token.username!;
      }
      if (token.githubToken) {
        session.githubToken = token.githubToken;
      }
      if (token.googleToken) {
        session.googleToken = token.googleToken;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      
      console.log("callback Profile",{profile,user,account,token})
      await dbConnect();
      if (user) {
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      if (account) {
        token.accessToken = account.access_token;
        if (account.provider === "github") {
          token.githubToken = account.access_token;
        }
        if (account.provider === "google") {
          token.googleToken = account.access_token;
        }

        // Check if the user already exists in the database
        let existingUser = await UserModel.findOne({ email: profile?.email });
        if (!existingUser) {
          // Create a new user if they don't exist
          existingUser = await UserModel.create({
            email: profile?.email,
            username: profile?.name?.split(' ')[0],
            password:await bcrypt.hash("RandomPass", 10),
            isVerified: true, 
            isAcceptingMessages: true,
          });
        }
        console.log("Exiting User:",existingUser)
        token._id = existingUser._id?.toString();
        token.isVerified = existingUser.isVerified;
        token.isAcceptingMessages = existingUser.isAcceptingMessages;
        token.username = existingUser.username;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/dashboard",
  },
};
