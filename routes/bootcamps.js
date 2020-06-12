const express = require("express");
const {
  getBootcamp,
  createBootcamp,
  deleteBootcamp,
  getBootcamps,
  updateBootcamp,
  getBootcampsInRadius,
} = require("../controllers/bootcamps");

// include other resourse router
const courseRouter = require("./courses");

const router = express.Router();

router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/").get(getBootcamps).post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
