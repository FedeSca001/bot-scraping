import express from "express";
import { logUser, registerUser, updateUser } from "../controllers/userController.js"; // Asegúrate de que la ruta sea correcta

const router = express.Router();

//LOG USUARIO
router.get('/:id/:user/:pass/:mail', logUser );

//REGISTRAR USUARIO
router.post('/new',registerUser)

//UPDATE USUARIO
router.put('/update',updateUser)

export default router;