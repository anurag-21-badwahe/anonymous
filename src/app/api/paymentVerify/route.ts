import { NextResponse, NextRequest } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "@/models/Payment";
import dbConnect from "@/lib/dbConnect";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY as string,
  key_secret: process.env.RAZORPAY_API_SECRET as string,
});

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    console.log("id ==", body);

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET as string)
      .update(body)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await dbConnect();

      const payment = await Payment.findOneAndUpdate(
        { razorpay_order_id },
        { paymentStatus: "success" },
        { new: true }
      );

      console.log("Payment status updated:", payment);

      return NextResponse.json(
        {
          message: "success",
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          message: "fail",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
