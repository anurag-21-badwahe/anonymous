"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { paymentSchema } from "@/schemas/paymentSchema";

export default function BuyMeACoffeePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      name: "",
      message: "",
      payment: 100
    },
  });
  
  const paymentAmount = form.watch("payment");

  const handleAmountClick = (amount: number) => {
    form.setValue("payment", amount);
  };
  const onSubmit = async (data: z.infer<typeof paymentSchema>) => {
    setIsSubmitting(true);
    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-2xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Buy Me a Coffee
          </div>
          <p className="mb-4">Support us by buying a coffee</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input {...field} name="Username" placeholder="Your Name" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Write Appropriate Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Send Your Message to Admin of this webapp"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount in Rupees</FormLabel>
                  <FormControl>
                    <Input {...field} name="amount" type = "number" placeholder="Amount" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center space-x-5">
            <span className="text-gray-700">Select Amount:</span>
            <Button
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleAmountClick(100)}
                >
                  100
                </Button>
                <Button
                 
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleAmountClick(200)}
                >
                  200
                </Button>
                <Button
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleAmountClick(500)}
                >
                  500
                </Button>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Buy Me a Coffee"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Go back to{" "}
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
              Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
