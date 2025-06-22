const TOKEN_KEY = "token";

const authData = {
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),

  // ✅ Extraer el usuario desde el token
  getUser: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const [, payload] = token.split(".");
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  },
};

export default authData;
