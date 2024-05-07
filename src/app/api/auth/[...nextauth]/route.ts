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
    async signIn({ account, profile, email, user }) {
      if (account?.provider === "github") {
        try {
          // Connect to MongoDB
          await mongoose.connect(process.env.MONGODB_URI as string, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          console.log("Connected to MongoDB");

          // Check if email exists and is a string
          if (typeof email === "string") {
            const currentUser = await User.findOne({ email });

            // If user doesn't exist, create a new user
            if (!currentUser) {
              const username = email.split("@")[0];
              const newUser = new User({
                email: email,
                name: profile?.name || "",
                username: username || "",
              });
              await newUser.save();
              console.log("New user created:", newUser);
              user.name = newUser.username;
            } else {
              console.log("User already exists:", currentUser);
              user.name = currentUser.username;
            }
          } else {
            console.error("Email is missing or invalid.");
            return false; // Return false to prevent sign in
          }
        } catch (error) {
          console.error("Error connecting to MongoDB:", error);
          return false; // Return false to prevent sign in
        } finally {
          // Disconnect from MongoDB after operation
          await mongoose.disconnect();
          console.log("Disconnected from MongoDB");
        }
      }

      return true; // Allow sign in
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
