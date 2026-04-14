import { User } from "firebase/auth";

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (value: boolean) => void;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm extends LoginForm {
  confirmPassword: string;
}