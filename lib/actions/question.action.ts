"use server";

import Question, { IQuestion } from "@/database/question.model";
import Tag, { ITag } from "@/database/tag.model";
import User from "@/database/user.model";
import { CreateQuestionParams, GetQuestionByIdParams, GetQuestionsParams } from "@/lib/actions/shared.types";
import { connectToDb } from "../mongoose";
import { formatResultFromDB } from "../utils";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
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
    console.log("Calling create question");

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
      .populate({ path: "author", model: User, select: "_id name picture clerkId" });

    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
