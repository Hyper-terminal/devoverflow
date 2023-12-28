"use server";

import Question, { IQuestion } from "@/database/question.model";
import Tag, { ITag } from "@/database/tag.model";
import { connectToDb } from "../mongoose";

export async function createQuestion(params: any) {
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
