"use server";

import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { connectToDb } from "../mongoose";
import { SearchParams } from "./shared.types";

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

    let results: any[] = [];

    if (type) {
      for (const { searchfield, model, fieldToReturn } of models) {
        const foundItems = await model
          .find({
            [searchfield]: { $regex: new RegExp(query as string, "i") },
          })
          .select(fieldToReturn)
          .projection({
            value: `$${fieldToReturn.split(" ")[1]}`,
          });

        // const mappedResults = foundItems?.map((item) => ({
        //   _id: item?.id || item?.clerkId,
        //   title: item?.name || item?.title || item?.question,
        // }));
        // results.push(...mappedResults);
        console.log(foundItems);
      }
    } else {
    }

    return results;
  } catch (error) {
    console.log(error);
    return null;
  }
};
