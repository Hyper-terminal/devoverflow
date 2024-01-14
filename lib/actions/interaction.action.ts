"use server";

import Interaction from "@/database/interaction.model";
import { connectToDb } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Question from "@/database/question.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDb();

    const { questionId, userId } = params;

    await Question.findOneAndUpdate({ _id: questionId }, { $inc: { views: 1 } });

    const interaction = await Interaction.findOne({ userId, question: questionId });

    if (interaction) {
      interaction.action = "view";
      await interaction.save();
    } else {
      await Interaction.create({ userId, question: questionId, action: "view" });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
