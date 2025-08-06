import express from "express";
import { getUser, registerUser } from "../Controllers/userController.js";
import { loginUser } from "../Controllers/userController.js";
import { updateUser } from "../Controllers/userController.js";
import { deleteUser } from "../Controllers/userController.js";
import { logoutUser } from "../Controllers/userController.js";
import { userAuth } from "../middleware/userAuth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update", userAuth, updateUser);
router.delete("/delete", userAuth, deleteUser);
router.post("/logout", userAuth, logoutUser);
router.get("/get-details", userAuth, getUser);

export default router;
