"use client";

import { useState, useEffect } from "react";
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
import { initiate } from "@/actions/payment";
import { useSession } from "next-auth/react";
import adminProfile from "../../../public/admin.jpeg"
import { BASE_URL } from "../../config.ts";
import { useRouter } from "next/navigation";

const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      reject(new Error("Razorpay SDK failed to load"));
    };
    document.body.appendChild(script);
  });
};

export default function BuyMeACoffeePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentForm, setPaymentForm] = useState({});
  const { data: session } = useSession();
  const router = useRouter()

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      name: "", 
      message: "",
      payment: 100,
    },
  });

  const onSubmit = async (data: z.infer<typeof paymentSchema>) => {
    setIsSubmitting(true);
    setPaymentForm(data);

    const paymentData = {
      username: data.name,
      message: data.message,
    };

    try {
      const orderVal = await initiate(data.payment, data.name, paymentData);
      const orderId = orderVal.id;
      const options = {
        key: process.env.RAZORPAY_KEY_ID, 
        amount: data.payment * 100, // Amount is in the smallest currency unit (paise for INR)
        currency: "INR",
        name: "Feedonymous",
        description: "Buy Me a Coffee",
        image: adminProfile,
        order_id: orderId,
        callback_url: `${BASE_URL}/buy-me-a-coffee`,
        handler: async function (response:any) {
          // if (response.length==0) return <Loading/>;
          console.log("Reponse",response);
  
          const data = await fetch(`${BASE_URL}/api/verify-payment`, {
            method: "POST",
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });  
         const res = await data.json();
          console.log("response verify==",res)
  
          if(res?.message=="success")
          {
            console.log("redirected.......")
            router.push("/paymentsuccess?paymentid="+response.razorpay_payment_id)
          }
        },
        prefill: {
          name: data.name,
          email: session?.user.email,
          contact: "6268766883",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const scriptLoaded = await loadRazorpayScript();
      if (scriptLoaded) {
        const rzp1 = new (window as any).Razorpay(options);
        rzp1.open();
      } else {
        console.error("Failed to load Razorpay SDK");
      }
    } catch (error) {
      console.error("Error during payment initiation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountClick = (amount: number) => {
    form.setValue("payment", amount);
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
                  <Input {...field} placeholder="Your Name" />
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
                    <Input
                      {...field}
                      type="tel"
                      pattern="[0-9]*"
                      placeholder="Amount"
                    />
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
