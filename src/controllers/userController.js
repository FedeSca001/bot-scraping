import bcryptjs from 'bcryptjs';

export const logUser = async (req, res) => {
    try {
        res.send('Hacer login')
    } catch (error) {
        res.send(error)
    }
}

export const registerUser = async (req, res) => {
    try {
        // Obtener la contraseña del cuerpo de la solicitud
        const { user, pass, mail } = req.body;

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
            mail: mail
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

export const updateUser = async (req, res) =>{
    try {
        const {id,user,pass,mail,newpass} = req.params
        res.send(id,user,pass,mail,newpass)
    } catch (error) {
        res.send(error)
    }
}