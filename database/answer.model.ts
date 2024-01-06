import { Document, Schema, model, models } from "mongoose";

export interface IAnswer extends Document {
  content: string;
  question: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  createdOn: Date;
}

const AnswerSchema = new Schema<IAnswer>({
  content: { type: String, required: true },
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  createdOn: { type: Date, default: Date.now },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
});

const Answer = models?.Answer || model<IAnswer>("Answer", AnswerSchema);

export default Answer;
