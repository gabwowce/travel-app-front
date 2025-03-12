export type UserProfile = {
  id: number;
  user_id: number;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  preferences: string | null;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  is_admin: number;
  profile: UserProfile;
};

export type AuthState = {
  isAuthenticated: boolean;
  loading: boolean;
  errors: AuthErrors | any;
  token: string | null;
  user: User | null; // ✅ Dabar `user` gali būti `null`, kai vartotojas nėra prisijungęs
};

export type AuthErrors = {
  email?: string;
  password?: string;
  general?: string;
};


export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type LoginResponse = {
  user: User;
  token: string;
};

export type RegisterResponse = {
  user: User;
  token: string;
};
