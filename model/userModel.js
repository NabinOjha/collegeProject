const mongooose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongooose.Schema;

const userSchema = new Schema(
  //common
  {
    userName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      required: [true, 'Please provide an email!'],
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
    },
    confirmPassword: {
      type: String,
      validate: [
        function validator(value) {
          return this.password === value;
        },
        'Passwords do not match',
      ],
    },
    role: {
      type: String,
      required: [true, 'Please provide a role'],
      enum: ['admin', 'employer', 'employee'],
    },
    image: {
      type: String,
    },

    //employee
    resume: {
      type: String,
    },

    //employer details
    companyName: String,
    phone: {
      type: Number,
    },
    companyAddress: {
      type: String,
    },
    companyDescription: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
});

userSchema.methods.comparePassword = async function (
  currentPassword,
  providedPassword
) {
  const isValid = await bcrypt.compare(providedPassword, currentPassword);

  return isValid;
};

module.exports = mongooose.model('User', userSchema);
