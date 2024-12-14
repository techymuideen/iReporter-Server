const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  lastname: {
    type: String,
    required: [true, 'Please tell us your last name!'],
  },
  othernames: {
    type: String,
    default: '',
  },
  phoneNumber: {
    type: String,
    unique: true,
    validate: [validator.isNumeric, 'Please provide a valid phone number'],
  },
  signupMethod: {
    type: String,
    default: 'email',
    enum: ['email', 'google', 'facebook', 'twitter'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    minlength: 4,
    maxlength: 20,
    validate: [
      validator.isAlphanumeric,
      'Username must contain only alphanumeric characters',
    ],
  },
  photo: {
    type: String,
    default:
      'https://res.cloudinary.com/dfxgefgqc/image/upload/v1733488719/default_a7m2rb.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: 'Passwords do not match.',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password only if it is being updated
userSchema.pre('save', async function (next) {
  // If the password is not being modified, skip hashing
  if (!this.isModified('password') || this.isNew) return next();

  // Hash the password
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
