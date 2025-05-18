const router = require("express").Router();

const {
  addUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  loginUser,
  logoutUser,
  refreshUserToken,
  userActivate,
} = require("../controllers/user.controller");

const userJwtGuard = require("../middlewares/guards/user-jwt.guard");
const userSelfGuard = require("../middlewares/guards/user-self.guard");

router.post("/create", addUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshUserToken);
router.get("/all", userJwtGuard, getAllUsers);
router.get("/activate/:link", userActivate);
router.get("/:id", userJwtGuard, userSelfGuard, getUserById);
router.put("/:id", userJwtGuard, userSelfGuard, updateUserById);
router.delete("/:id", userJwtGuard, userSelfGuard, deleteUserById);

module.exports = router;
