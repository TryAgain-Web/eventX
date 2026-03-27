export interface SignUp {
  username: string;
  email: string;
  password: string;
}

export interface Login {
  email: string;
  password: string;
}

export type SocialLinks = {
  twitter?: string;
  github?: string;
  linkedin?: string;
  // Allow future social providers without changing the API contract.
  [key: string]: string | undefined;
};

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  bio?: string | null;
  profilePicture?: string | null;
  socialLinks?: SocialLinks | null;
}

export type UpdateUserRequest = {
  username: string;
  bio?: string | null;
  profilePicture?: string | null;
  socialLinks?: SocialLinks | null;
};

export interface AuthSuccessResponse {
  message: string;
  userId: number;
}
