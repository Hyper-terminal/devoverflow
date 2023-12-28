import User from "@/database/user.model";
import { connectToDb } from "../mongoose";

export async function getUserById(params: any) {
  try {
    const userId = params?.userId;

    connectToDb();

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}
