import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Event', eventSchema);
