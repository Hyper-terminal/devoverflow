import { Document, Schema, model, models } from "mongoose";

interface IUser extends Document {
  username: string;
  name: string;
  email: string;
  password?: string;
  bio?: string;
  joinedAt: Date;
  picture: string;
  location?: string;
  portfolioWebsite?: string;
  clerkId: string;
  reputation?: number;
  savedQuestions?: Schema.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  savedQuestions: [{ type: Schema.Types.ObjectId, ref: "Question", default: [] }],
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  bio: { type: String },
  joinedAt: { type: Date, default: Date.now },
  picture: { type: String },
  location: { type: String },
  portfolioWebsite: { type: String },
  clerkId: { type: String, required: true },
  reputation: { type: Number, default: 0 },
});

const User = models?.User || model<IUser>("User", UserSchema);

export default User;
