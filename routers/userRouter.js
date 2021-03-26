const express = require("express");

const router = express.Router();

const User = require("../models/User");
const advanceResults = require("../middlewares/advanceResults");
const userController = require("../controllers/userController");
const protect = require("../middlewares/auth");

router.use(protect.protect);
router.use(protect.authorize("admin"));

router
  .route("/")
  .get(advanceResults(User), userController.getUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
