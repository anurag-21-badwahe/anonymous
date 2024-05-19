// "use server";

// import Razorpay from "razorpay";
// import PaymentModel from "@/models/Payment";
// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/models/Usermsg";
// import { Currency } from "lucide-react";

// type InitiateResponse = {
//   id: string;
// };

// export const initiate = async (amount, to_username, paymentform) => {
//   const connect = await dbConnect();
//   var instance = new Razorpay({
//     key_id: process.env.LIVE_PAYMENT_KEY_ID,
//     key_secret: process.env.LIVE_PAYMENT_KEY_SECRET,
//   });

//   let options = {
//     username:to_username,
//     amount: Number.parseInt(amount),
//     currency: "INR",
//   };

//   let order = await instance.orders.create(options);

//   await PaymentModel.create({
//     orderId: order.id,
//     amount: amount,
//     to_user:to_username,
//     username:paymentform.username,
//     message:paymentform.message
//   });
// };


"use server";

import Razorpay from "razorpay";
import PaymentModel from "@/models/Payment";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/Usermsg";

type InitiateResponse = {
  id: string;
};

export const initiate = async (
  amount: number,
  to_username: string,
  paymentform: { username: string; message: string }
): Promise<InitiateResponse> => {
  await dbConnect();

  const instance = new Razorpay({
    key_id: process.env.LIVE_PAYMENT_KEY_ID,
    key_secret: process.env.LIVE_PAYMENT_KEY_SECRET,
  });

  const options = {
    amount: amount * 100, // Amount in smallest currency unit (paise for INR)
    currency: "INR",
    receipt: `receipt_${Date.now()}`, // Adding a receipt identifier
  };

  const order = await instance.orders.create(options);

  await PaymentModel.create({
    orderId: order.id,
    amount: amount,
    to_user: to_username,
    username: paymentform.username,
    message: paymentform.message,
  });

  return { id: order.id };
};
