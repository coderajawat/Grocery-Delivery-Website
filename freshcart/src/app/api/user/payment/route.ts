import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY!,
  key_secret: process.env.RAZORPAY_SECRET_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { userId, items, paymentMethod, totalAmount, address } =
      await req.json();

    if (!items || !userId || !paymentMethod || !totalAmount || !address) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    // Create Order in DB
    const newOrder = await Order.create({
      user: userId,
      items,
      paymentMethod,
      totalAmount,
      address,
      isPaid: false,
    });

    // Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${newOrder._id}`,
      notes: {
        orderId: newOrder._id.toString(),
      },
    });

    return NextResponse.json(
      {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        key: process.env.RAZORPAY_API_KEY,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Order Payment error - ${error}` },
      { status: 500 }
    );
  }
}
