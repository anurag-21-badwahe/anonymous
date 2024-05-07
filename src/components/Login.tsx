"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react"
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import googleIcon from "../../public/googleIcon.png";
import githubIcon from "../../public/githubIcon.png";
import Image from "next/image";

const Login = () => {
    const { data: session } = useSession();
    // if (session) {
    //    const router = useRouter();
    //    router.push('/home')
    //   }
  return (
    <>
      <div className="w-screen h-screen bg-yellow-100 flex items-center justify-center">
        <div className="max-w-md bg-white text-center py-16">
          <div className="text-3xl text-black px-1">Welcome to feedonymous</div>
          <div className="m-auto px-4 my-28">
            <div onClick={()=>{signIn("google")}} className="border border-gray-400 rounded-2xl px-4 py-2 mb-4 text-black flex items-center justify-center">
              <Image
                src={googleIcon.src}
                alt="Google Icon"
                className="w-6 h-6 mr-2"
                height={6}
                width={6}
              />
            <span className="flex-1">Login With Google</span>
            </div>

            <div onClick={()=>{signIn("github")}} className="border border-gray-400 rounded-2xl px-4 py-2 mb-4 text-black flex items-center justify-center">
              <Image
                src={githubIcon.src}
                alt="GitHub Icon"
                className="w-6 h-6 mr-2"
                height={6}
                width={6}
              />
              <span className="flex-1">Login With GitHub</span>
            </div>

            <div className="border border-gray-400 rounded-2xl px-4 py-2 mb-4">
              Login With Facebook
            </div>
            <div className="border border-gray-400 rounded-2xl px-4 py-2 mb-4">
              Login With Twitter
            </div>
            <div className="border border-gray-400 rounded-2xl px-4 py-2 mb-4">
              Login With LinkedIn
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
