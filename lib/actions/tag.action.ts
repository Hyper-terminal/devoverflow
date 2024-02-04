"use server";

import Question from "@/database/question.model";
import Tag, { ITag } from "@/database/tag.model";
import User from "@/database/user.model";
import { FilterQuery } from "mongoose";
import { connectToDb } from "../mongoose";
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "./shared.types";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDb();

    const { userId } = params;

    const user = User.findById(userId);
    if (!user) throw new Error("User not found");

    // find interactions for the user and group by tags...

    return [
      { _id: 1, name: "tag1" },
      { _id: 2, name: "tag2" },
    ];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDb();

    const { searchQuery } = params;

    if (searchQuery) {
      const tags = await Tag.find({ name: { $regex: searchQuery, $options: "i" } });
      return tags;
    }

    const tags = await Tag.find({});

    return tags;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getQuestionByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectToDb();

    const { tagId, searchQuery } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery ? { title: { $regex: searchQuery, $options: "i" } } : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        {
          path: "tags",
          model: Tag,
          select: "_id name",
        },
        {
          path: "author",
          model: User,
          select: "_id name clerkId picture",
        },
      ],
    });

    if (!tag) throw new Error("Tag not found");

    return { tagTitle: tag.name, questions: tag.questions };
  } catch (error) {
    console.log(error);
    throw new Error("Error getting question by tag id");
  }
}

export async function getHotTags() {
  try {
    await connectToDb();

    const tags = Tag.aggregate([{ $project: { name: 1, questions: { $size: "$questions" } } }, { $sort: { questions: -1 } }]);

    return tags;
  } catch (error) {
    console.log(error);
    return null;
  }
}
