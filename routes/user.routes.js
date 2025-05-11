const express = require("express").Router();

const {
  addUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  loginUser,
} = require("../controllers/user.controller");

const userJwtGuard = require("../middlewares/guards/user-jwt.guard");
const userSelfGuard = require("../middlewares/guards/user-self.guard");

router.post("/", addUser);
router.post("/login", loginUser);
router.get("/", userJwtGuard, getAllUsers);
router.get("/:id", userJwtGuard, userSelfGuard, getUserById);
router.put("/:id", userJwtGuard, userSelfGuard, updateUserById);
router.delete("/:id", userJwtGuard, userSelfGuard, deleteUserById);

module.exports = router;
