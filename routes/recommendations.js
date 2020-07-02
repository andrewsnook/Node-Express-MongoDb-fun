const express = require("express");
const {
  getRecommendation,
  getRecommendations,
  deleteRecommendation,
  updateRecommendation,
  createRecommendation,
} = require("../controllers/recommendations");

const Recommendation = require("../models/Recommendation");

// include other resourse router
const deepDiveRouter = require("./deepdives");

const router = express.Router();

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router.use("/:recommendationId/deepdives", deepDiveRouter);

// router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/")
  .get(advancedResults(Recommendation), getRecommendations)
  .post(protect, authorize("user", "admin"), createRecommendation);

router
  .route("/:id")
  .get(advancedResults(Recommendation), getRecommendation)
  .put(protect, authorize("user", "admin"), updateRecommendation)
  .delete(protect, authorize("admin"), deleteRecommendation);

module.exports = router;
