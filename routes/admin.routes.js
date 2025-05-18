const router = require("express").Router();

const {
  addAdmin,
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
} = require("../controllers/admin.controller");

const adminJwtGuard = require("../middlewares/guards/admin-jwt.guard")
const adminSelfGuard = require("../middlewares/guards/admin-self.guard");

router.post("/create", addAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/refresh", refreshAdminToken);
router.get("/all", adminJwtGuard, getAllAdmins);
router.get("/:id", adminJwtGuard, adminSelfGuard, getAdminById);
router.put("/:id", adminJwtGuard, adminSelfGuard, updateAdminById);
router.delete("/:id", adminJwtGuard, adminSelfGuard, deleteAdminById);

module.exports = router;
