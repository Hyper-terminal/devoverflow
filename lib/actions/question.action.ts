"use server";

import Answer from "@/database/answer.model";
import Question, { IQuestion } from "@/database/question.model";
import Tag, { ITag } from "@/database/tag.model";
import User from "@/database/user.model";
import {
  CreateQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "@/lib/actions/shared.types";
import { revalidatePath } from "next/cache";
import { connectToDb } from "../mongoose";
import { formatResultFromDB } from "../utils";

export async function getQuestions(
  params: GetQuestionsParams
): Promise<{ questions: any; isNext: boolean }> {
  try {
    await connectToDb();
    const { searchQuery, filter, page = 1, pageSize = 20 } = params;

    let query = {};

    if (searchQuery) {
      query = {
        $or: [
          { title: { $regex: new RegExp(searchQuery, "i") } },
          { content: { $regex: new RegExp(searchQuery, "i") } },
          {
            tags: {
              $elemMatch: { name: { $regex: new RegExp(searchQuery, "i") } },
            },
          },
        ],
      };
    }

    // questions to skip
    const skip = (page - 1) * pageSize;

    let filterOptions = {};

    switch (filter) {
      case "newest":
        filterOptions = { createdOn: -1 };

        break;

      case "frequent":
        filterOptions = { views: -1 };
        break;

      case "unanswered":
        filterOptions = { answers: { $size: 0 } };
        break;

      case "recommended":
        filterOptions = { likes: -1 };
        break;
    }

    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort(filterOptions)
      .skip(skip)
      .limit(pageSize);

    const totalQuestions = await Question.find(query).countDocuments();
    const isNext = totalQuestions > questions.length + skip;

    return { questions: formatResultFromDB(questions), isNext: isNext } as {
      questions: any;
      isNext: boolean;
    };
  } catch (error) {
    console.log(error);
    return { questions: null, isNext: false };
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    // Validate input parameters
    if (
      !params ||
      !params.title ||
      !params.content ||
      !params.tags ||
      !params.author
    ) {
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
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag);
    }

    // Update question with tags and save
    question.tags = tagDocuments.map((tag) => tag._id);
    await question.save();

    // increase the reputation of the author of the question
    const author = await User.findById(params.author);
    author.reputation += 5;
    await author.save();

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

export async function upvoteQuestion(
  QuestionVote: QuestionVoteParams
): Promise<void> {
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

    // handle reputation of the author of the question and the user who upvoted the question
    const author = await User.findById(question.author);
    const user = await User.findById(userId as string);

    if (hasupVoted) {
      author.reputation -= 5;
      user.reputation -= 5;
    } else {
      author.reputation += 5;
      user.reputation += 5;
    }

    await author.save();
    await user.save();

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

    // handle reputation of the author of the question and the user who downvoted the question
    const author = await User.findById(question.author);
    const user = await User.findById(userId as string);

    if (hasdownVoted) {
      author.reputation += 2;
      user.reputation += 2;
    } else {
      author.reputation -= 2;
      user.reputation -= 2;
    }

    await author.save();
    await user.save();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateQuestion(params: EditQuestionParams) {
  try {
    await connectToDb();

    const { questionId, title, content, tags, authorID } = params;

    // if the authorID is not the same as the author of the question, throw an error

    const question = await Question.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    if (question.author.toString() !== authorID.toString()) {
      throw new Error("You are not authorized to edit this question");
    }

    const tagDocuments: ITag[] = [];

    // Process tags
    for (const tagName of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tagName}$`, "i") } },
        {
          $setOnInsert: { name: tagName },
          $push: { questions: question._id },
        },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag);
    }

    // Update question with tags and save

    question.title = title;
    question.content = content;
    question.tags = tagDocuments.map((tag) => tag._id);
    await question.save();

    return { success: true, message: "Question updated successfully" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHotQuestions() {
  try {
    await connectToDb();

    const questions = await Question.find({})
      .sort({ likes: -1, views: -1 })
      .limit(10);

    return questions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
