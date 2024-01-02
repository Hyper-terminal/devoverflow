"use server";

import { revalidatePath } from "next/cache";
import { connectToDb } from "../mongoose";
import { CreateAnswerParams } from "./shared.types";
import Question from "@/database/question.model";
import Answer from "@/database/answer.model";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await connectToDb();
    const { question, author, path, content } = params;

    const answer = await Answer.create({
      question,
      content,
      author,
    });

    await Question.findOneAndUpdate({ _id: question }, { $push: { answers: answer._id } });

    revalidatePath(path);
    return answer;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
