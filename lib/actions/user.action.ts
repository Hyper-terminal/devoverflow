"use server";

import Question from "@/database/question.model";
import User from "@/database/user.model";
import mongoose, { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import { connectToDb } from "../mongoose";
import {
  CreateUserParams,
  DeleteAnswerParams,
  DeleteQuestionParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";
import Interaction from "@/database/interaction.model";

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
    const user = await User.create(userData, { new: true });

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
    const { searchQuery, filter } = params;

    let filterOptions = {};

    switch (filter) {
      case "new_users":
        filterOptions = { joinedAt: -1 };
        break;

      case "old_users":
        filterOptions = { joinedAt: 1 };
        break;

      case "top_contributors":
        filterOptions = { reputation: -1 };
        break;

      default:
        break;
    }

    if (searchQuery) {
      const users = await User.find({ name: { $regex: searchQuery, $options: "i" } }).sort(filterOptions);
      return users;
    }

    const users = await User.find({}).sort(filterOptions);
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

    const { clerkId, searchQuery } = params;

    const query: FilterQuery<typeof Question> = searchQuery ? { $title: { $regex: new RegExp(searchQuery, "i") } } : {};

    const user = User.findOne({ clerkId }).populate({
      path: "savedQuestions",
      match: query,
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

export async function getUserInfoById(params: GetUserByIdParams) {
  try {
    const userId = params?.userId;

    await connectToDb();

    const user = await User.findOne({ clerkId: userId });

    // find answers and questions by the user
    const totalUserAnswers = await Answer.countDocuments({ author: user?._id });
    const totalUserQuestions = await Question.countDocuments({ author: user?._id });

    if (!user) {
      throw new Error("user not found");
    }

    user.totalUserAnswers = totalUserAnswers;
    user.totalUserQuestions = totalUserQuestions;

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getAllQuestionByUser(params: any) {
  try {
    const userId = params?.userId;

    await connectToDb();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("user not found");
    }

    const questions = await Question.find({ author: user?._id })
      .populate({ path: "author", select: "name clerkId picture _id", model: User })
      .populate({ path: "tags", select: "name _id", model: Tag })
      .sort({ createdAt: -1 });

    return questions;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getAllAnswersByUser(params: any) {
  try {
    const userId = params?.userId;

    await connectToDb();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("user not found");
    }

    const questions = await Answer.find({ author: user?._id }).sort({ createdAt: -1 });

    return questions;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    const { questionId } = params;

    await connectToDb();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const deletedQuestion = await Question.findByIdAndDelete(questionId, { session });

      const deleteAnswerPromise = Answer.deleteMany({ question: questionId }, { session });
      const updateTagPromise = Tag.updateMany({ questions: questionId }, { $pull: { questions: questionId } }, { session });
      const deleteInteractionPromise = Interaction.deleteMany({ question: questionId }, { session });
      const updateUserPromise = User.updateMany({ savedQuestions: questionId }, { $pull: { savedQuestions: questionId } }, { session });

      await Promise.all([deleteAnswerPromise, updateTagPromise, deleteInteractionPromise, updateUserPromise]);

      await session.commitTransaction();
      session.endSession();

      return deletedQuestion;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    const { answerId } = params;

    await connectToDb();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const deletedAnswer = await Answer.findByIdAndDelete(answerId, { session });

      const deleteInteractionPromise = Interaction.deleteMany({ answer: answerId }, { session });
      const updateQuestionPromise = Question.updateMany({ answers: answerId }, { $pull: { answers: answerId } }, { session });
      const updateUserPromise = User.updateMany({ savedAnswers: answerId }, { $pull: { savedAnswers: answerId } }, { session });
      const TagUserPromise = Tag.updateMany({ answers: answerId }, { $pull: { answers: answerId } }, { session });

      await Promise.all([deleteInteractionPromise, updateQuestionPromise, updateUserPromise, TagUserPromise]);

      await session.commitTransaction();
      session.endSession();

      return deletedAnswer;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateProfile(params: UpdateUserParams) {
  try {
    const { clerkId, updateData, path } = params;

    await connectToDb();

    const user = await User.findOneAndUpdate({ clerk: clerkId }, updateData, { new: true });

    revalidatePath(path);

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}
