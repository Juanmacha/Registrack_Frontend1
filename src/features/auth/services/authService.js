import authData from "./authData";

const USERS_KEY = "usuarios_mock"; // Unificado con mockDataService

// Función para simular un JWT (base64 codificado)
const createFakeToken = (user) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify(user)); // Incluye email, name, role, etc.
  const signature = "firma-falsa"; // Simulación

  return `${header}.${payload}.${signature}`;
};

const authService = {
  // Registrar un nuevo usuario
  register: (userData) => {
    let usuarios = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

    const yaExiste = usuarios.some(user => user.email === userData.email);
    if (yaExiste) {
      return { success: false, message: "El correo ya está registrado." };
    }

    // Rol por defecto: "user"
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      role: userData.role || "user",
      estado: "activo"
    };

    usuarios.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));

    const fakeToken = createFakeToken(newUser);
    authData.setToken(fakeToken);

    return { success: true, token: fakeToken };
  },

  // Iniciar sesión
  login: ({ email, password }) => {
    const usuarios = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

    const usuarioEncontrado = usuarios.find(
      user => user.email === email && user.password === password
    );

    if (!usuarioEncontrado) {
      return { success: false, message: "Credenciales inválidas" };
    }

    const fakeToken = createFakeToken(usuarioEncontrado);
    authData.setToken(fakeToken);

    return { success: true, token: fakeToken, user: usuarioEncontrado };
  },
};

export default authService;

// Crear admin predeterminado si no existe
(() => {
  const usuarios = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  const yaHayAdmin = usuarios.some(user => user.email === "admin@demo.com");

  if (!yaHayAdmin) {
    usuarios.push({
      id: Date.now().toString(),
      email: "admin@demo.com",
      password: "admin123",
      name: "Administrador",
      role: "Administrador",
      estado: "activo"
    });

    localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));

    console.log("✅ Admin predeterminado creado: admin@demo.com / admin123");
  }
})();
