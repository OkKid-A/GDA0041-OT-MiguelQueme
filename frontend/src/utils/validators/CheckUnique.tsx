import api from "../api.ts";

interface CheckUniqueResponse {
  isUnique: boolean;
}

// Funcion que revisa que un atributo sea unico en la base de datos
export const checkUnique = async ( value: string) => {
  try {
    const response = await api.get(`/usuarios/unique/${value}`);
    const data = response.data as CheckUniqueResponse;
    return data.isUnique;
  } catch {
    return false;
  }
};
