import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // Nos permite guardar el jwt token en una cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptamos errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      // Creamos un error para ayudar en la validación de tipos.
      const cError = new Error(
        `HTTP ${error.response.status}: ${error.response.statusText}`,
      );
      cError.name = "API Error";
      cError.stack = error.stack;
      cError.message = error.response.data as string;
      console.log(cError.message);
      return Promise.reject(cError);
    }
    return Promise.reject(new Error("Error inesperado al conectar a la api."));
  },
);

export default api;
