const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const unverifiedUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email address.'],
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please provide a valid email address.']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: [8, 'Password should be at least 8 characters long.'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm the password.'],
    validate: {
      validator: function(value) {
        return value === this.password;
      },
      message: 'Passwords do not match.'
    }
  },
})

unverifiedUserSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

const UnverifiedUser = mongoose.model('UnverifiedUser', unverifiedUserSchema);
module.exports = UnverifiedUser