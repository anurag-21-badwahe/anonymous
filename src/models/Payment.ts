import mongoose, { Schema, Document } from "mongoose";

export interface Payment extends Document {
  username: string;
  message: string;
  amount: number;
  time: Date;
}

const PaymentSchema: Schema<Payment> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"]
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    }
  },
  { timestamps: true }
);

const PaymentModel =
  (mongoose.models.Payment as mongoose.Model<Payment>) ||
  mongoose.model<Payment>("Payment", PaymentSchema);

export default PaymentModel;
