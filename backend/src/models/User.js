import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    avatar: {
  type: String,
  default: '',
},
    age: {
      type: Number,
      min: 0,
      default: null,
    },
    gender: {
      type: String,
      trim: true,
      default: '',
    },
    height_cm: {
      type: Number,
      min: 0,
      default: null,
    },
    weight_kg: {
      type: Number,
      min: 0,
      default: null,
    },
    goal: {
      type: String,
      trim: true,
      default: '',
    },
    target_weight_kg: {
  type: Number,
  min: 0,
  default: null,
},

activity_level: {
  type: String,
  default: 'Moderate',
},

diet_type: {
  type: String,
  default: 'Balanced',
},

role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user',
},
    streak: {
      type: Number,
      min: 0,
      default: 0,
    },
    last_activity_date: {
  type: String,
  default: null,
},
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        delete ret._id;
        delete ret.password;
        return ret;
      },
    },
  }
);

export default mongoose.model('User', userSchema);
