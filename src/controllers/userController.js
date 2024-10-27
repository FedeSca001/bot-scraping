import bcryptjs from 'bcryptjs';


export const registerUser = async (req, res) => {
    try {
        // Obtener la contraseña del cuerpo de la solicitud
        const { user, pass, mail } = req.body;
        console.log({user,pass,mail});
        
        if (!user || !pass || !mail) {
            return res.status(400).send('Todos los campos son obligatorios.');
        }
        // Generar un token de 200 caracteres
        let generateTokenId = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 200; i++) {
            generateTokenId += characters[Math.floor(Math.random() * characters.length)];
        }
        // Generar el hash de la contraseña
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(pass, salt);
        // Enviar respuesta con el token y el hash
        res.send({
            id: generateTokenId,
            user: user,
            pass: hashedPassword,
            mail: mail,
            logued: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};


export const updateUser = async (req, res) => {
    try {
        // Extraemos los datos del cuerpo de la solicitud
        const { id, user, pass, mail, hashedPass, newpass } = req.body;

        // Validamos que todos los campos necesarios estén presentes
        if (!id || !user || !pass || !hashedPass) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        // Comparamos la contraseña proporcionada (pass) con la almacenada (hashedPass)
        const passwordMatch = await bcryptjs.compare(pass, hashedPass);

        if (!passwordMatch) {
            return res.status(401).json({ message: "La contraseña actual es incorrecta." });
        }

        let hashedPassword = hashedPass; // Por defecto mantenemos la contraseña anterior

        // Si hay una nueva contraseña (newpass), la hasheamos
        if (newpass) {
            const salt = await bcryptjs.genSalt(10);
            hashedPassword = await bcryptjs.hash(newpass, salt);
        }

        // Simulamos la lógica de actualización en una base de datos
        // En un caso real, deberías conectar aquí con tu base de datos para actualizar el usuario
        const updatedUser = {
            id,
            user,
            pass: hashedPassword,
            mail
        };

        // Si todo salió bien, enviamos la respuesta con el usuario actualizado
        return res.status(200).json(updatedUser);

    } catch (error) {
        // En caso de error, respondemos con un mensaje de error
        return res.status(500).json({ message: "Error actualizando el usuario", error });
    }
};