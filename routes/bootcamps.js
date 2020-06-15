const express = require("express");
const {
  getBootcamp,
  createBootcamp,
  deleteBootcamp,
  getBootcamps,
  updateBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

const Bootcamp = require("../models/Bootcamp");

const advancedResults = require("../middleware/advancedResults");

// include other resourse router
const courseRouter = require("./courses");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, createBootcamp);

router.route("/:id/photo").put(protect, bootcampPhotoUpload);

router
  .route("/:id")
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

module.exports = router;
