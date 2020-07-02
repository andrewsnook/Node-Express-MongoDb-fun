const mongoose = require("mongoose");

const DeepDiveSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a deep dive title"],
    maxlength: 100,
  },
  link: {
    type: String,
    required: [true, "Please add a link"],
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid URL",
    ],
  },
  category: {
    type: [String],
    required: true,
    enum: ["Educational", "Fun", "Thought Provoking", "Practical", "Other"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  recommendation: {
    type: mongoose.Schema.ObjectId,
    ref: "Recommendation",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// // prevent user submitting more than one review per bootcamp
// ReviewSchema.index(
//   { bootcamp: 1, user: 1 },
//   {
//     unique: true,
//   }
// );

// //static method to get avg rating
// ReviewSchema.statics.getAverageRating = async function (bootcampId) {
//   const obj = await this.aggregate([
//     {
//       $match: { bootcamp: bootcampId },
//     },
//     {
//       $group: {
//         _id: "$bootcamp",
//         averageRating: { $avg: "$rating" },
//       },
//     },
//   ]);

//   try {
//     await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
//       averageRating: obj[0].averageRating,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

module.exports = mongoose.model("DeepDive", DeepDiveSchema);
