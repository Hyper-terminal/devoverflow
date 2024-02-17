"use server";

import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { connectToDb } from "../mongoose";
import { SearchParams } from "./shared.types";
import { formatResultFromDB } from "../utils";

export const globalSearch = async (params: SearchParams) => {
  try {
    await connectToDb();
    const allowedTypes = ["question", "answer", "user", "tag"];

    const { type, query } = params;

    const models = [
      {
        model: Question,
        type: "question",
        searchfield: "title",
        fieldToReturn: "_id title",
      },
      {
        model: Answer,
        type: "answer",
        searchfield: "content",
        fieldToReturn: "_id question",
      },
      {
        model: Tag,
        type: "tag",
        searchfield: "name",
        fieldToReturn: "_id name",
      },
      {
        model: User,
        type: "user",
        searchfield: "name",
        fieldToReturn: "clerkId name",
      },
    ];

    const results: any[] = [];

    if (!allowedTypes.includes(type as string)) {
      for (const { searchfield, model, fieldToReturn } of models) {
        const foundItems = await model
          .find({
            [searchfield]: { $regex: new RegExp(query as string, "i") },
          })
          .select(fieldToReturn);

        results.push(...foundItems);
      }
    } else if (allowedTypes.includes(type as string)) {
      const foundModel = models?.find((item) => item?.type === type);

      const foundItems = await foundModel?.model
        ?.find({
          [foundModel.searchfield]: {
            $regex: new RegExp(query as string, "i"),
          },
        })
        .select(foundModel.fieldToReturn);
      results.push(...foundItems!);
    } else throw new Error();
    return formatResultFromDB(results);
  } catch (error) {
    console.log(error);
    return null;
  }
};
