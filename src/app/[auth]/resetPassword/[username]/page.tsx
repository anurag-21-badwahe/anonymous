'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { passwordSchema} from '@/schemas/passwordSchema';


export default function ResetPassword() {
  const router = useRouter();
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: z.infer<typeof passwordSchema>) => {
    setIsSubmitting(true);
    try {
      // Check if passwords match
      if (data.newPassword !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const response = await axios.post<ApiResponse>(`/api/update-password`, {
        username,
        newPassword: data.newPassword,
      });

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace(`/auth/sign-in`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Reset Password Failed',
        description:
          axiosError.response?.data.message ??
          'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Reset Your Password
          </h1>
          <p className="mb-4">Enter the reset password code sent to your email</p>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="newPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <Input type="password" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <Input type="password" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Submit"
            )}
          </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
