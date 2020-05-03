import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
  salt: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
});

const User = mongoose.model<User>("User", UserSchema);
export default User;
