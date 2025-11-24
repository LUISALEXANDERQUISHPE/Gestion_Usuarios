export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DecodedToken {
  id: string;
  email: string;
  exp: number;
  iat: number;
}
