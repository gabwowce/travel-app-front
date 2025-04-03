export interface User {
    id:                number;
    name:              string;
    email:             string;
    email_verified_at: null;
    is_admin:          boolean;
    profile:           Profile;
}

export interface Profile {
    id:       number;
    user_id:  number;
    bio:      null;
    location: null;
    website:  null;
}

export type AuthState = {
  isAuthenticated: boolean;
  loading: boolean;
  errors: AuthErrors | any;
  token: string | null;
  user: User | null; 
};

export type AuthErrors = {
  [field: string]: string[];
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

export type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};

export type LoginResponse = ApiResponse<{
  user: User;
  token: string;
}>;

export type RegisterResponse = ApiResponse<{
  user: User;
  token: string;
}>;

export type AuthErrorResponse = {
  status: "error";
  message: string;
  data: {
    errors: AuthErrors;
  };
};

