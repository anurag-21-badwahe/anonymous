"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast";
import { signInSchema } from "@/schemas/signinSchema";
import googleIcon from "../../../../public/googleIcon.png";
import githubIcon from "../../../../public/githubIcon.png";
import Image from "next/image";

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingGoogleBtn, setIsSubmittingGoogleBtn] = useState(false);
  const [isSubmittingGithubBtn, setIsSubmittingGithubBtn] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    // console.log("Data :", data);
    // console.log("Clicked");
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    // console.log("Result :", result);
    // console.log("Data :", data.identifier);
    // console.log("Data pass:", data.password);

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast({
          title: "Login Failed",
          description: "Incorrect username or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    }

    if (result?.url) {
      // console.log("Success");
      router.replace("/dashboard");
    }
    setIsSubmitting(false);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
 
  
  const handleGoogleSignIn = async () => {
    setIsSubmittingGoogleBtn(true);
    try {
      await signIn("google");
      router.replace('/dashboard')
      setIsSubmittingGoogleBtn(false);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      toast({
        title: "Sign In Failed",
        description:
          "There was a problem signing in with Google. Please try again.",
        variant: "destructive",
      });
      setIsSubmittingGoogleBtn(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setIsSubmittingGithubBtn(true);
    try {
      await signIn("github");
      // router.replace(`/verify/${username}`);
      router.replace('/dashboard')
      router.replace('/dashboard')
      // setIsSubmittingGithubBtn(false);
    } catch (error) {
      console.error("Error during GitHub sign-in:", error);
      toast({
        title: "Sign In Failed",
        description:
          "There was a problem signing in with Github. Please try again.",
        variant: "destructive",
      });
      setIsSubmittingGithubBtn(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to Feedonymous
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input {...field} placeholder="email/username" />
                  <FormMessage />
                </FormItem>
              )}
            />
           <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      {...field}
                      placeholder="password"
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? (
                        <EyeOffIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-center mt-4">
              <Link
                href="/auth/resetPasswordEmail"
                className="text-blue-600 hover:text-blue-800"
              >
                Forget Password?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{" "}
            <Link
              href="/auth/sign-up"
              className="text-blue-600 hover:text-blue-800"
            >
              Sign up
            </Link>
          </p>
        </div>
        <div className="text-center">-------------or-------------</div>

        <div className="flex justify-between">
          <Button
            onClick={handleGoogleSignIn}
            className="bg-blue-700 py-2 px-4 rounded-md hover:bg-blue-500 w-1/2 mr-2 flex items-center justify-center"
          >
            {" "}
            {isSubmittingGoogleBtn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="hidden xs:inline">Please Wait</span>
              </>
            ) : (
              <>
                <Image
                  src={googleIcon.src}
                  width={6}
                  height={6}
                  alt="Google Icon"
                  className="w-6 h-6 mr-2"
                />
                <span className="hidden xs:inline">Continue with Google</span>
              </>
            )}
          </Button>
          <Button
            onClick={handleGitHubSignIn}
            className="bg-gray-800 py-2 px-4 rounded-md hover:bg-gray-600 w-1/2 mr-2 flex items-center justify-center"
          >
            {isSubmittingGithubBtn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="hidden xs:inline">Please Wait</span>
              </>
            ) : (
              <>
                <Image
                  src={githubIcon.src}
                  width={6}
                  height={6}
                  alt="Github Icon"
                  className="w-6 h-6 mr-2"
                />
                <span className="hidden xs:inline">Continue with Github</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
