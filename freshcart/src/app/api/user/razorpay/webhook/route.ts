import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    console.log("Webhook hit");

    // Get raw body safely (important for signature verification)
    const rawBodyBuffer = Buffer.from(await req.arrayBuffer());

    // Get signature from header
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      console.error("Missing signature header");
      return NextResponse.json(
        { message: "Missing signature" },
        { status: 400 }
      );
    }

    // Get webhook secret from env
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not defined in .env.local");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBodyBuffer)
      .digest("hex");

    console.log("Received Signature:", signature);
    console.log("Expected Signature:", expectedSignature);

    // Compare signatures
    if (signature !== expectedSignature) {
      console.error("Invalid signature");
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 400 }
      );
    }

    // Parse event
    const event = JSON.parse(rawBodyBuffer.toString());
    console.log("Webhook Event:", event.event);

    // Handle payment success events
    if (
      event.event === "payment.captured" ||
      event.event === "order.paid"
    ) {
      const payment = event.payload.payment.entity;
      const orderId = payment.notes?.orderId;

      console.log("Order ID from notes:", orderId);

      if (!orderId) {
        console.error("Order ID missing in notes");
        return NextResponse.json(
          { message: "Order ID missing" },
          { status: 400 }
        );
      }

      await connectDb();

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          isPaid: true,
          status: "paid",
        },
        { new: true }
      );

      console.log("Order updated successfully:", updatedOrder?._id);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { message: "Webhook error" },
      { status: 500 }
    );
  }
}
