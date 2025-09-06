import mongoose, { Schema } from "mongoose";

interface UserDetailDocument {
  user: mongoose.Schema.Types.ObjectId;
  // Basic Information
  firstName?: string;
  lastName?: string;
  username?: string;
  displayName?: string;
  dateOfBirth?: string;
  gender?: string;

  // Contact Information
  email?: string;
  phone?: string;
  alternateEmail?: string;
  website?: string;

  // Location
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  address?: string;

  // Professional
  jobTitle?: string;
  company?: string;
  industry?: string;
  experience?: string;
  workDescription?: string;

  // Education
  education?: string;
  fieldOfStudy?: string;
  school?: string;
  graduationYear?: number;

  // Social Media
  linkedin?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  facebook?: string;
  portfolio?: string;

  // Personal
  relationshipStatus?: string;
  languages?: string;
  interests?: string;
  bio?: string;
  favoriteQuote?: string;

  // Privacy
  profilePublic?: boolean;
  showEmail?: boolean;
  allowMessages?: boolean;
  emailNotifications?: boolean;
  onboardingCompleted?: boolean;
}

const UserDetailSchema = new Schema<UserDetailDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Basic Information
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "non-binary", "prefer-not-to-say"],
    },

    // Contact Information
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    alternateEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    website: {
      type: String,
      trim: true,
    },

    // Location
    country: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },

    // Professional
    jobTitle: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      enum: ["0-1", "2-5", "6-10", "11-15", "16+"],
    },
    workDescription: {
      type: String,
      trim: true,
    },

    // Education
    education: {
      type: String,
      enum: [
        "high-school",
        "associate",
        "bachelor",
        "master",
        "doctorate",
        "other",
      ],
    },
    fieldOfStudy: {
      type: String,
      trim: true,
    },
    school: {
      type: String,
      trim: true,
    },
    graduationYear: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear() + 10,
    },

    // Social Media
    linkedin: {
      type: String,
      trim: true,
    },
    twitter: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    instagram: {
      type: String,
      trim: true,
    },
    facebook: {
      type: String,
      trim: true,
    },
    portfolio: {
      type: String,
      trim: true,
    },

    // Personal
    relationshipStatus: {
      type: String,
      enum: [
        "single",
        "in-relationship",
        "married",
        "divorced",
        "widowed",
        "complicated",
      ],
    },
    languages: {
      type: String,
      trim: true,
    },
    interests: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      maxLength: 1000,
    },
    favoriteQuote: {
      type: String,
      trim: true,
      maxLength: 500,
    },

    // Privacy
    profilePublic: {
      type: Boolean,
      default: false,
    },
    showEmail: {
      type: Boolean,
      default: false,
    },
    allowMessages: {
      type: Boolean,
      default: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserDetail =
  (mongoose.models.UserDetail as mongoose.Model<UserDetailDocument>) ||
  mongoose.model<UserDetailDocument>("UserDetail", UserDetailSchema);

export default UserDetail;
