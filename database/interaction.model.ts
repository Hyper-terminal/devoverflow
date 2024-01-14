import { Document, Schema, model, models } from "mongoose";

export interface IInteraction extends Document {
  userId: string;
  action: string;
  answer: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId[];

  createdOn: Date;
}

const InteractionSchema = new Schema<IInteraction>({
  userId: { type: String, required: true },
  action: { type: String, required: true },
  answer: { type: Schema.Types.ObjectId, ref: "Answer" },
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],

  createdOn: { type: Date, default: Date.now },
});

const Interaction = models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
