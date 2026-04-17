export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

export interface AuthState {
  authUser: AuthUser | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  setAuthUser: (user: AuthUser | null) => void;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm extends LoginForm {
  confirmPassword: string;
}