export interface AuthResponse {
  token: string;
  id: string;
  role: 'USER' | 'RESTAURANT';
}
