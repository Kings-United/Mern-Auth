import express, { Router } from 'express';
import { formdata, updateUser, userLogin, userSignUp } from '../controllers/controllers.js';
import { check } from '../middleware/middleware.js';
import { createUser, deleteUser, updateUserData, userDashboard, userLog, userRegister } from '../controllers/usercontroller.js';

// const router = Router();

const router = express.Router();

router.post('/login', userLogin);
router.put('/update/:id', updateUser);
router.get('/signup', check, userSignUp);
router.post('/form', formdata);

router.post('/create-user', createUser);
router.put('/update-user', updateUserData);
router.delete('/delete-user/:id', deleteUser);
router.post('/log', userLog);
router.post('/register', userRegister);
router.get('/detail', userDashboard);

export default router;