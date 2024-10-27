import express from "express";
import {  registerUser, updateUser } from "../controllers/userController.js"; // Asegúrate de que la ruta sea correcta

const router = express.Router();

//REGISTRAR USUARIO
router.post('/new',registerUser)

//UPDATE USUARIO
router.put('/update',updateUser)

export default router;