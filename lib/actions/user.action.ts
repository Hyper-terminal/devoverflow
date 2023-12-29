import Question from "@/database/question.model";
import User from "@/database/user.model";
import { connectToDb } from "../mongoose";
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

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

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDb();
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateUser(userData: UpdateUserParams) {
  try {
    connectToDb();
    // use find one and update method to update user details
    const user = await User.findOneAndUpdate({ clerkId: userData.clerkId }, userData?.updateData, { new: true });
    revalidatePath(userData?.path);
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function deleteUser(userData: DeleteUserParams) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    connectToDb();

    const user = await User.findOne({ clerkId: userData?.clerkId });

    if (!user) {
      return null;
    }

    // delete everything that the particular user has done.

    // const userQuestionIds = await Question.find({ author: user?._id }).distinct("_id");

    await Question.deleteMany({ author: user?._id });

    // todo: delete user comments and answers etc.

    const deletedUser = await User.findByIdAndDelete(user?._id);

    await session.commitTransaction();
    session.endSession();

    return deletedUser;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    return null;
  }
}
