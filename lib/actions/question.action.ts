"use server";

import Answer from "@/database/answer.model";
import Question, { IQuestion } from "@/database/question.model";
import Tag, { ITag } from "@/database/tag.model";
import User from "@/database/user.model";
import { CreateQuestionParams, GetQuestionByIdParams, GetQuestionsParams, QuestionVoteParams } from "@/lib/actions/shared.types";
import { revalidatePath } from "next/cache";
import { connectToDb } from "../mongoose";
import { formatResultFromDB } from "../utils";

export async function getQuestions(params: GetQuestionsParams): Promise<{ questions: any }> {
  try {
    connectToDb();
    const questions = await Question.find({}).populate({ path: "tags", model: Tag }).populate({
      path: "author",
      model: User,
    });

    return { questions: formatResultFromDB(questions) };
  } catch (error) {
    console.log(error);
    return { questions: null };
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    // Validate input parameters
    if (!params || !params.title || !params.content || !params.tags || !params.author) {
      throw new Error("Invalid input parameters");
    }

    // Connect to the database
    await connectToDb();

    // Create a new question with default values
    const question: IQuestion = await Question.create({
      title: params.title,
      content: params.content,
      author: params.author,
      answers: [],
      upvotes: [],
      downvotes: [],
      views: 0,
      likes: 0,
    });

    const tagDocuments: ITag[] = [];

    // Process tags
    for (const tagName of params.tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tagName}$`, "i") } },
        {
          $setOnInsert: { name: tagName },
          $push: { questions: question._id },
        },
        { upsert: true, new: true },
      );
      tagDocuments.push(existingTag);
    }

    // Update question with tags and save
    question.tags = tagDocuments.map((tag) => tag._id);
    await question.save();

    // need to revalidate the path
    revalidatePath(params.path);

    return {
      success: true,
      message: "Question created successfully",
      question,
    };
  } catch (error: any) {
    console.error(error?.message || error);
    return {
      error: "Internal server error",
    };
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    await connectToDb();

    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id name picture clerkId",
      })
      .populate({
        path: "answers",
        model: Answer,
        select: "_id content author createdOn upvotes downvotes",
        populate: {
          path: "author",
          model: User,
          select: "_id name picture clerkId",
        },
      });

    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * Upvotes or removes upvote from a question based on the provided parameters.
 * @param QuestionVote - The parameters for upvoting a question.
 * @returns {Promise<void>} - A promise that resolves when the upvote is successfully processed.
 * @throws {Error} - If the question is not found or an error occurs during the upvote process.
 */

export async function upvoteQuestion(QuestionVote: QuestionVoteParams): Promise<void> {
  try {
    await connectToDb();

    const { path, hasdownVoted, hasupVoted, userId, questionId } = QuestionVote;

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * Downvotes a question based on the provided QuestionVoteParams.
 * @param QuestionVote - The parameters for downvoting a question.
 * @returns {Promise<void>} - A promise that resolves when the question is successfully downvoted.
 * @throws {Error} - If the question is not found or an error occurs during the downvoting process.
 */

export async function downvoteQuestion(QuestionVote: QuestionVoteParams) {
  try {
    await connectToDb();

    const { path, hasdownVoted, hasupVoted, userId, questionId } = QuestionVote;

    let updateQuery = {};

    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
