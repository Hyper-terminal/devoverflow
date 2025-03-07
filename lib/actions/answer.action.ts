"use server";

import { revalidatePath } from "next/cache";
import { connectToDb } from "../mongoose";
import { AnswerVoteParams, CreateAnswerParams } from "./shared.types";
import Question from "@/database/question.model";
import Answer from "@/database/answer.model";
import User from "@/database/user.model";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await connectToDb();
    const { question, author, path, content } = params;

    const answer = await Answer.create({
      question,
      content,
      author,
      upvotes: [],
      downvotes: [],
    });

    // increase the reputation of the author of the question and the author of the answer
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    // add the answer to the question
    const questionUpdated = await Question.findOneAndUpdate(
      { _id: question },
      { $push: { answers: answer._id } }
    );

    await User.findByIdAndUpdate(questionUpdated.author, {
      $inc: { reputation: 2 },
    });

    revalidatePath(path);
    return answer;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    await connectToDb();

    const { userId, answerId, hasdownVoted, hasupVoted, path } = params;

    let updateQuery = {};

    // if hasdownVoted is true, then we need to remove the downvote
    if (hasdownVoted) {
      updateQuery = {
        $pull: {
          downvotes: userId,
        },
        $addToSet: {
          upvotes: userId,
        },
      };
    }

    // if hasupVoted is true, then we need to remove the upvote
    else if (hasupVoted) {
      updateQuery = {
        $pull: {
          upvotes: userId,
        },
      };
    }

    // if neither hasupVoted nor hasdownVoted is true, then we need to add the upvote
    else {
      updateQuery = {
        $addToSet: {
          upvotes: userId,
        },
      };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    // handle reputation of the author of the answer and the user who upvoted the answer
    const author = await User.findById(answer.author);
    const user = await User.findById(userId as string);

    if (hasupVoted) {
      author.reputation -= 2;
      user.reputation -= 2;
    } else {
      author.reputation += 2;
      user.reputation += 2;
    }

    await author.save();
    await user.save();

    revalidatePath(path);

    return answer;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    await connectToDb();

    const { userId, answerId, hasdownVoted, hasupVoted, path } = params;

    let updateQuery = {};

    // if hasupVoted is true, then we need to remove the upvote
    if (hasupVoted) {
      updateQuery = {
        $pull: {
          upvotes: userId,
        },
        $addToSet: {
          downvotes: userId,
        },
      };
    }

    // if hasdownVoted is true, then we need to remove the downvote
    else if (hasdownVoted) {
      updateQuery = {
        $pull: {
          downvotes: userId,
        },
      };
    }
    // if neither hasupVoted nor hasdownVoted is true, then we need to add the downvote
    else {
      updateQuery = {
        $addToSet: {
          downvotes: userId,
        },
      };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    // handle reputation of the author of the answer and the user who downvoted the answer
    const author = await User.findById(answer.author);
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

    return answer;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
