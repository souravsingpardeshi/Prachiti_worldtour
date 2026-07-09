import mongoose, { Schema, Document } from 'mongoose';

export interface IPassport extends Document {
  passportId: string;
  progress: {
    completedIds: number[];
    currentId: number;
    xp: number;
    hearts: Record<string, any>;
  };
  itinerary: any;
  scratched: number[];
}

const PassportSchema: Schema = new Schema({
  passportId: { type: String, required: true, unique: true, default: 'default' },
  progress: {
    completedIds: { type: [Number], default: [] },
    currentId: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    hearts: { type: Schema.Types.Mixed, default: {} }
  },
  itinerary: { type: Schema.Types.Mixed, default: null },
  scratched: { type: [Number], default: [] }
});

export const Passport = mongoose.model<IPassport>('Passport', PassportSchema);

export interface IPhoto extends Document {
  passportId: string;
  photoId: string;
  base64: string;
}

const PhotoSchema: Schema = new Schema({
  passportId: { type: String, required: true, index: true },
  photoId: { type: String, required: true },
  base64: { type: String, required: true }
});

// Compound index to ensure one photo per ID per passport
PhotoSchema.index({ passportId: 1, photoId: 1 }, { unique: true });

export const Photo = mongoose.model<IPhoto>('Photo', PhotoSchema);
