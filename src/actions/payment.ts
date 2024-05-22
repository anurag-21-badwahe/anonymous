"use server";

import Razorpay from "razorpay";
import PaymentModel from "@/models/Payment";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/Usermsg";

type InitiateResponse = {
  id: string;
  key_id:string
};

export const initiate = async (
  amount: number,
  to_username: string,
  paymentform: { username: string; message: string }
): Promise<InitiateResponse> => {
  await dbConnect();

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("Razorpay key_id or key_secret is not defined in environment variables");
  }

  const instance = new Razorpay({
    key_id,
    key_secret,
  });

  const options = {
    amount: amount * 100, // Amount in smallest currency unit (paise for INR)
    currency: "INR",
    receipt: `receipt_${Date.now()}`, 
  };

  const order = await instance.orders.create(options);

  await PaymentModel.create({
    orderId: order.id,
    amount: amount,
    to_user: "Anurag Badwahe",
    username: paymentform.username,
    message: paymentform.message,
  });

  // Return both id and key_id
  return { id: order.id, key_id: key_id };
};
