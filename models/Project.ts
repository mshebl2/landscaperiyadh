import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  image: string;
  galleryImages?: string[];
  tags: string[];
  category: string;
  year: string;
  link?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    titleAr: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    descriptionAr: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    galleryImages: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 4;
        },
        message: 'Gallery images cannot exceed 4 images',
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);







