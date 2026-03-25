export interface SignUp {
  username: string;
  email: string;
  password: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}
