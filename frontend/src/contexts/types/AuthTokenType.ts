export interface AuthTokenType {
  // Tipo usado para garantizar el parseo de JSON al verificar el token
  token: string;
  rol: number | null;
}
