import mongoose from "mongoose";
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import User from "@/modals/Usermsg";
import dbConnect from "@/lib/dbConnect";
import {authOptions} from "./option"



const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
