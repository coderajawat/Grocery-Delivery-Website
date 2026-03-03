import mongoose from "mongoose";

export interface IOrder {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: [{
    grocery: mongoose.Types.ObjectId;
    name: string;
    price: number;
    unit: string;
    image: string;
    quantity: number;
  }];
  isPaid?: boolean;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    mobile: string;
    city: string;   
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  status: "pending" | "out for delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new mongoose.Schema<IOrder>({
    user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        grocery: { type: mongoose.Schema.Types.ObjectId, ref: 'Grocery', required: true },
        name: { type: String },
        price: { type: Number },
        unit: { type: String }, 
        image: { type: String },
        quantity: { type: Number },
    }],
    paymentMethod: { type: String, enum: ['cod', 'online'], default: 'cod' },
    isPaid: { type : Boolean, default: false},
    totalAmount: { type: Number, required: true },
    address: {
        fullName: { type: String },
        mobile: { type: String },   
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        fullAddress: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
    },
    status: { type: String, enum: ['pending', 'out for delivery', 'delivered'], default: 'pending' },
    
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
