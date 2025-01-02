export interface AuthContextType {
  // Tipo usado para el hook de autenticacion

  token: string | null;
  role: number | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
