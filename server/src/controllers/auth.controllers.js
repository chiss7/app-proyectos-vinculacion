import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// In-memory user store for example purposes
const users = [
  {
    id: 1,
    username: "marce",
    password: "$2a$12$R3aQ8dpQBZnCXKh6tQnj/e5/V68C2gn1DBD6kt73kZgPWhHmesJ6O", // hashed 'marce'
  },
];

const AuthController = {
  login: (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user.id }, "secret_key", { expiresIn: "1h" });
    res.json({ token });
  },
};

export default AuthController;
