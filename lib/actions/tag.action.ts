"use server";

import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { connectToDb } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";

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

    const tags = await Tag.find({});

    return tags;
  } catch (error) {
    console.log(error);
    return null;
  }
}
