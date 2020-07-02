const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const RecommendationSchema = new mongoose.Schema(
  {
    what: {
      type: String,
      required: [true, "Please add a recommendation"],
      unique: false,
      maxlength: [50, "Recommendation cannot be longer than 50 chars"],
    },
    slug: String,
    who: {
      type: String,
      required: [true, "Please add who recommended"],
      maxlength: [50, "Description cannot be more than 50 chars"],
    },
    where: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL",
      ],
    },
    linkto: {
      type: String,
      required: false,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL",
      ],
    },
    category: {
      type: [String],
      required: true,
      enum: ["Movie", "Book", "Podcast", "TV", "Other"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// create slug from name
RecommendationSchema.pre("save", function (next) {
  this.slug = slugify(this.what + "_" + this.who, {
    lower: true,
  });
  next();
});

// //GEOCODE create location field
// BootcampSchema.pre("save", async function (next) {
//   const loc = await geocoder.geocode(this.address);
//   this.location = {
//     type: "Point",
//     coordinates: [loc[0].longitude, loc[0].latitude],
//     formattedAddress: loc[0].formattedAddress,
//     street: loc[0].streetName,
//     city: loc[0].city,
//     state: loc[0].stateCode,
//     zipcode: loc[0].zipCode,
//     country: loc[0].countryCode,
//   };
//   // do not save address
//   this.address = undefined;

//   next();
// });

//cascade delete

// BootcampSchema.pre("remove", async function (next) {
//   console.log(`Courses being removed ${this._id}`);
//   await this.model("Course").deleteMany({ bootcamp: this._id });
//   next();
// });

// BootcampSchema.virtual("courses", {
//   ref: "Course",
//   localField: "_id",
//   foreignField: "bootcamp",
//   justOne: false,
// });

module.exports = mongoose.model("Recommendation", RecommendationSchema);
