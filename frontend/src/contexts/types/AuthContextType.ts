export interface AuthContextType {
  // Tipo usado para el contexto de autenticacion

  token: string | null;
  role: number | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  revisarAuth: () => Promise<void>;
}
