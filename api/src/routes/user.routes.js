const express = require("express");
const userController = require("../controllers/user.controller");
const authM = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/checkUser", authM, userController.checkUser);
router.get("/:identifier", authM, userController.getUser);
router.put("/:id", authM, userController.updateUser);
router.delete("/:id", authM, userController.deleteUser);

module.exports = router;
