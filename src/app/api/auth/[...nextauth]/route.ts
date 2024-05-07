import mongoose from "mongoose";
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import User from "@/modals/User";

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
          // Connect to the DB
          const client = await mongoose.connect(process.env.MONGODB_URI as string);
          console.log("DB Connected");
          
  
          // Find the user in the database
          const currentUser = await User.findOne({ email: email });
          console.log("currentUser",currentUser);
          
  
          // If user doesn't exist, create a new user
          if (!currentUser) {
            const newUser = new User({
              email: email,
              username: email.split("@")[0],
            });
            await newUser.save();
            user.name = newUser.username;
          } else {
            // If user exists, set user name
            user.name = currentUser.username;
          }
        } catch (error) {
          // Handle error
          console.log("Error with DB");
          
          console.error("Error:", error);
        }
        return true
      }
    }
  }
  
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
