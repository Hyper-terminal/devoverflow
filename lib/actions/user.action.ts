"use server";

import Question from "@/database/question.model";
import User from "@/database/user.model";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { connectToDb } from "../mongoose";
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetSavedQuestionsParams, ToggleSaveQuestionParams, UpdateUserParams } from "./shared.types";

export async function getUserById(params: any) {
  try {
    const userId = params?.userId;

    await connectToDb();

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
    const user = new User(userData, { new: true });
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

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await connectToDb();

    // const { page = 1, pageSize = 10, filter, searchQuery } = params;

    const users = await User.find({}).sort({ createdAt: -1 });
    return users;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    await connectToDb();

    const { questionId, userId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("user not found");
    }

    const savedQuestions = user?.savedQuestions;

    const questionIndex = savedQuestions?.indexOf(questionId);

    let updateQuery = {};

    if (questionIndex !== -1) {
      updateQuery = { $pull: { savedQuestions: questionId } };
    } else {
      updateQuery = { $push: { savedQuestions: questionId } };
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateQuery, { new: true });

    revalidatePath(path);

    return updatedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    await connectToDb();

    const { clerkId } = params;

    const user = User.findOne({ clerkId }).populate({
      path: "savedQuestions",
      match: {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "author", select: "name clerkId picture _id" },
        { path: "tags", select: "name _id" },
      ],
    });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
