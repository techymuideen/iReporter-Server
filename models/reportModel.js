const mongoose = require('mongoose');
const slugify = require('slugify');

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the report'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for the report'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reject', 'resolved', 'investigating'],
      default: 'pending',
    },
    type: {
      type: String,
      enum: ['red-flag', 'intervention'],
      required: [true, 'Please provide a type for the report'],
    },
    slug: String,
    images: [String],
    videos: [String],

    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
    },

    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please provide an author for the report'],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
reportSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Report = new mongoose.model('Report', reportSchema);

module.exports = Report;
