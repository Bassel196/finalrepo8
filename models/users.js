const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const addressSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  house: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    userImagePath: [String],
    facebook: {
      id: String,
      token: String,
      email: String,
      name: String,
    },
    google: {
      id: String,
      token: String,
      email: String,
      name: String,
    },
    havePassword: {
      type: Boolean,
      default: true,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: true,
    },
    address: {
      type: [addressSchema],
    },
    otp: {
      type: Number,
    },
    passwordResetId: {
      type: String,
    },
    redeemedCoupons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
      },
    ],
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  findByUsername: function (model, queryParameters) {
    // Add additional query parameter - AND condition - active: true
    queryParameters.isActive = true;
    return model.findOne(queryParameters)
  },
})

userSchema.pre('save', async (next)=>{
  try {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(this.password,salt)
      this.password = hashedPassword
      next()
  } catch (error) {
      next(error)
  }
})


module.exports = mongoose.model("User", userSchema);
