"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import * as z from "zod";
import { verifyEmailSchema } from "@/schemas/forgetPasswordEmailSchema";

export default function ResetPassword() {
  const router = useRouter();
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifyEmailSchema>>({
    resolver: zodResolver(verifyEmailSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: z.infer<typeof verifyEmailSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>("/api/resetPassword", {
        username,
        email: data.email,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace(`/auth/verifyResetPasswordCode/${username}`);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Reset Password Failed",
        description:
          axiosError.response?.data.message ??
          "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false)
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Enter Your Email
          </h1>
          <p className="mb-4">
            We will send you a reset password OTP to your email
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Your Email</FormLabel>
                  <Input {...field} />
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
               " Send Otp"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
