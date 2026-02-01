"use client";

import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import googleIcon from "../../../../public/googleIcon.png";
import githubIcon from "../../../../public/githubIcon.png";
import Image from "next/image";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingGoogleBtn, setIsSubmittingGoogleBtn] = useState(false);
  const [isSubmittingGithubBtn, setIsSubmittingGithubBtn] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage(""); // Reset message
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-unique-username?username=${username}`
          );
          setUsernameMessage(response.data.message);
          // console.log("response msg :",response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);
  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
 

  const handleGoogleSignIn = async () => {
    setIsSubmittingGoogleBtn(true);
    try {
      await signIn("google");
      // router.replace(`/verify/${username}`);
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

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace(`verify/${username}`);

      setIsSubmitting(false);
    } catch (error) {
      console.error("Error during sign-up:", error);

      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      let errorMessage = axiosError.response?.data.message;
      ("There was a problem with your sign-up. Please try again.");

      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-2xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Feedonomous
          </div>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    placeholder="Steve"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === "Username is unique" ||
                        usernameMessage === "Username is available"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    {...field}
                    name="email"
                    placeholder="stevejobs@gmail.com"
                  />
                  <p className="text-muted text-blue-400 text-sm">
                    We will send you a verification code
                  </p>
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link
              href="/auth/sign-in"
              className="text-blue-600 hover:text-blue-800"
            >
              Sign in
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


