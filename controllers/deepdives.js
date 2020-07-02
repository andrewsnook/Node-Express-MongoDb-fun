const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { query, request } = require("express");
const DeepDive = require("../models/DeepDive");
const Recommendation = require("../models/Recommendation");

// @desc    Get deepdives
// @route   GET /api/v1/deepdives
// @route   GET /api/v1/recommendation/:recommendationId/deepdives
// @access  Public
exports.getDeepDives = asyncHandler(async (req, res, next) => {
  if (req.params.recommendationId) {
    const deepDives = await DeepDive.find({
      recommendation: req.params.recommendationId,
    });
    return res.status(200).json({
      success: true,
      count: deepDives.length,
      data: deepDives,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single deep dive
// @route   GET /api/v1/deepdive/:id
// @access  Public
exports.getDeepDive = asyncHandler(async (req, res, next) => {
  const deepdive = await DeepDive.findById(req.params.id).populate({
    path: "recommendation",
    select: "what who",
  });

  if (!review) {
    return next(
      new ErrorResponse(`No deep dive found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: deepdive,
  });
});

// @desc    Add a deep dive
// @route   POST /api/v1/recommendation/:recommendationid/deepdives
// @access  Private
exports.addDeepDive = asyncHandler(async (req, res, next) => {
  req.body.recommendation = req.params.recommendationId;
  req.body.user = req.user.id;

  const recommendation = await Recommendation.findById(
    req.params.recommendationId
  );

  if (!recommendation) {
    return next(
      new ErrorResponse(
        `No recommendation found with id ${req.params.recommendationId}`,
        404
      )
    );
  }
  const deepdive = await DeepDive.create(req.body);

  res.status(201).json({
    success: true,
    data: deepdive,
  });
});

// @desc    Update deep dive
// @route   POST /api/v1/deepdive/:id
// @access  Private
exports.updateDeepDive = asyncHandler(async (req, res, next) => {
  let deepdive = await DeepDive.findById(req.params.id);

  if (!deepdive) {
    return next(
      new ErrorResponse(`No deep dive found with id ${req.params.id}`, 404)
    );
  }

  // make sure review belongs to user
  if (deepdive.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorised to update deep dive`, 401));
  }

  deepdive = await DeepDive.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    data: deepdive,
  });
});

// @desc    delete deep dive
// @route   DELETE /api/v1/deepdives/:id
// @access  Private
exports.deleteDeepDive = asyncHandler(async (req, res, next) => {
  const deepdive = await DeepDive.findById(req.params.id);

  if (!deepdive) {
    return next(
      new ErrorResponse(`No deep dive found with id ${req.params.id}`, 404)
    );
  }

  // make sure review belongs to user
  if (deepdive.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorised to delete deep dive`, 401));
  }

  await deepdive.remove();

  res.status(201).json({
    success: true,
    data: {},
  });
});
