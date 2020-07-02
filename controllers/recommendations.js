const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Recommendation = require("../models/Recommendation");
const { request } = require("express");

// @desc    Get all recommendations
// @route   GET /api/v1/recommendations
// @access  Public
exports.getRecommendations = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single recommendations
// @route   GET /api/v1/recommendations/:id
// @access  Public
exports.getRecommendation = asyncHandler(async (req, res, next) => {
  const recommendation = await Recommendation.findById(req.params.id);

  if (!recommendation) {
    return next(
      new ErrorResponse(
        `Recommendation not found with id of  ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: recommendation,
  });
});

// @desc    Create new recommendation
// @route   POST /api/v1/recommendations
// @access  Private
exports.createRecommendation = asyncHandler(async (req, res, next) => {
  //add user to request
  req.body.user = req.user.id;

  //check for published recommendations
  const publishedRecommendation = await Recommendation.findOne({
    user: req.user.id,
  });

  // if the user is not an admin they can only add one recommendation
  if (publishedRecommendation && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a recommendation`,
        400
      )
    );
  }

  const bc = await Recommendation.create(req.body);

  res.status(201).json({
    success: true,
    data: bc,
  });
});

// @desc    Update recommendation
// @route   GET /api/v1/recommendations/:id
// @access  Private
exports.updateRecommendation = asyncHandler(async (req, res, next) => {
  let recommendation = await recommendation.findById(req.params.id);

  if (!recommendation) {
    return next(
      new ErrorResponse(
        `Recommendation not found with id of  ${req.params.id}`,
        404
      )
    );
  }

  if (
    recommendation.user.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorised to update this recommendation`,
        401
      )
    );
  }

  recommendation = await Recommendation.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({
    success: true,
    data: recommendation,
  });
});

// @desc    Delete recommendation
// @route   DELETE /api/v1/recommendations/:id
// @access  Private
exports.deleteRecommendation = asyncHandler(async (req, res, next) => {
  const recommendation = await Recommendation.findById(req.params.id);

  if (!recommendation) {
    return next(
      new ErrorResponse(
        `Recommendation not found with id of  ${req.params.id}`,
        404
      )
    );
  }

  if (
    recommendation.user.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorised to delete this recommendation`,
        401
      )
    );
  }

  recommendation.remove();

  res.status(201).json({
    success: true,
    data: {},
  });
});

// // @desc    Get recommendations within a radius
// // @route   DELETE /api/v1/recommendations/radius:zipcode/:distance
// // @access  Private
// exports.getRecommendationsInRadius = asyncHandler(async (req, res, next) => {
//   const { zipcode, distance } = req.params;

//   const loc = await geocoder.geocode(zipcode);
//   const lat = loc[0].latitude;
//   const lng = loc[0].longitude;

//   const radius = distance / 6378;
//   const recommendations = await recommendation.find({
//     location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
//   });

//   res.status(200).json({
//     success: true,
//     count: recommendations.length,
//     data: recommendations,
//   });
// });

// @desc    Upload photo for recommendation
// @route   DELETE /api/v1/recommendations/:id/photo
// @access  Private
// exports.recommendationPhotoUpload = asyncHandler(async (req, res, next) => {
//   const recommendation = await recommendation.findById(req.params.id);

//   if (!recommendation) {
//     return next(
//       new ErrorResponse(
//         `recommendation not found with id of  ${req.params.id}`,
//         404
//       )
//     );
//   }

//   if (
//     recommendation.user.toString() !== req.user.id &&
//     req.user.role !== "admin"
//   ) {
//     return next(
//       new ErrorResponse(
//         `User ${req.params.id} is not authorised to add a photo`,
//         401
//       )
//     );
//   }

//   if (!req.files) {
//     return next(new ErrorResponse(`Please upload a file`, 400));
//   }

//   const file = req.files.file;

//   // make sure its a photo

//   if (!file.mimetype.startsWith("image")) {
//     return next(new ErrorResponse(`Please upload an image file`, 400));
//   }

//   //check filesize
//   if (file.size > process.env.MAX_FILE_UPLOAD) {
//     return next(
//       new ErrorResponse(
//         `Please upload an image file size < ${process.env.MAX_FILE_UPLOAD}`,
//         400
//       )
//     );
//   }

//   file.name = `photo_${recommendation._id}${path.parse(file.name).ext}`;

//   file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
//     if (err) {
//       console.log(err);
//       return next(new ErrorResponse(`Problem with file upload`, 500));
//     }

//     await recommendation.findByIdAndUpdate(req.params.id, { photo: file.name });

//     res.status(200).json({
//       success: true,
//       data: file.name,
//     });
//   });
// });
