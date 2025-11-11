const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs"); // ✅ Cambiado a bcryptjs para compatibilidad con Jest

const prisma = new PrismaClient();

// Servicio para registrar un usuario
const registerUser = async ({ nombre, apellidos, email, username, cell_number, password, role }) => {
    // Verificar si el email o username ya existen
    const existingUser = await prisma.users.findFirst({
        where: {
            OR: [
                { email },
                { username }
            ]
        }
    });

    if (existingUser) {
        throw new Error("El email o username ya están registrados");
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en la base de datos
    const newUser = await prisma.users.create({
        data: {
            nombre,
            apellidos,
            email,
            username,
            cell_number,
            password: hashedPassword,
            role: role || "user"
        }
    });

    // No devolver la contraseña en la respuesta
    const { password: _, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
};

module.exports = { registerUser };
