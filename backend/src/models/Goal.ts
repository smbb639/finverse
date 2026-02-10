import mongoose, { Schema, Document } from "mongoose";

export interface IGoal extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  targetAmount: number;
  deadline: Date;
  description?: string;
  createdAt: Date;
}

const GoalSchema = new Schema<IGoal>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    deadline: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

GoalSchema.index({ user: 1 });

export default mongoose.model<IGoal>("Goal", GoalSchema);