"use server";

import User from "@/database/user.model";
import { connectToDb } from "../mongoose";
import { GetTopInteractedTagsParams } from "./shared.types";

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
