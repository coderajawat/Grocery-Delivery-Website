import mongoose from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string;
  //address: string;
}

//schema creation
const userSchema = new mongoose.Schema<IUser>({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: false
    },
    mobile:{
        type: String,
        required: false
    },
    role:{
        type: String,
        enum: ["user", "deliveryBoy", "admin"],
        default: "user"
    },
    image:{
        type: String
    }
}, { timestamps: true });


//model creation
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;