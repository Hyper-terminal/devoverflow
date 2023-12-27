"use server";

import { connectToDb } from "../mongoose";

export async function createQuestion(params: any) {
  try {
    // connect the db here
    connectToDb();
  } catch (error) {}
}
