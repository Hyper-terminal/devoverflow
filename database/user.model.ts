import { Document, Schema, model, models } from "mongoose";

interface IUser extends Document {
  username: string;
  name: string;
  email: string;
  password?: string;
  bio?: string;
  joinedAt: Date;
  avatar: string;
  location?: string;
  portfolioWebsite?: string;
  clerkId: string;
  reputation?: number;
  saved?: Schema.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  bio: { type: String },
  joinedAt: { type: Date, default: Date.now },
  avatar: { type: String },
  location: { type: String },
  portfolioWebsite: { type: String },
  clerkId: { type: String, required: true },
  reputation: { type: Number, default: 0 },
  saved: [{ type: Schema.Types.ObjectId, ref: "Question" }],
});

const User = models?.User || model<IUser>("User", UserSchema);

export default User;
