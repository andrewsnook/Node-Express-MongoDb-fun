const express = require("express");
const {
  getDeepDive,
  getDeepDives,
  updateDeepDive,
  deleteDeepDive,
  addDeepDive,
} = require("../controllers/deepdives");

const DeepDive = require("../models/DeepDive");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(DeepDive, {
      path: "recommendation",
      select: "who what",
    }),
    getDeepDives
  )
  .post(protect, authorize("user", "admin"), addDeepDive);

router
  .route("/:id")
  .get(getDeepDive)
  .put(protect, authorize("user", "admin"), updateDeepDive)
  .delete(protect, authorize("user", "admin"), deleteDeepDive);

module.exports = router;
